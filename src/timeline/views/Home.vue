<template>
  <div class="timeline-page">
    <section class="timeline-header">
      <div>
        <p class="overline">Exercise Timeline</p>
        <h1 class="title is-3">Operational timeline</h1>
        <p class="subtitle is-6">Events, injects, commands, observations, media, and chat in one scrollable view.</p>
      </div>
      <div class="timeline-stats">
        <div>
          <span>{{ filteredItems.length }}</span>
          <small>Items</small>
        </div>
        <div>
          <span>{{ lanes.length }}</span>
          <small>Lanes</small>
        </div>
      </div>
    </section>

    <section class="timeline-toolbar">
      <div class="source-filters">
        <button v-for="source in sourceOptions"
                :key="source.value"
                type="button"
                class="source-chip"
                :class="{'is-active': selectedSources.includes(source.value)}"
                :style="chipStyle(source)"
                @click="toggleSource(source.value)">
          <span class="source-dot"></span>
          <span>{{ source.label }}</span>
        </button>
      </div>
      <div class="toolbar-actions">
        <button type="button"
                class="button is-small"
                @click="selectAllSources">
          All
        </button>
        <button type="button"
                class="button is-small"
                @click="refreshTimeline">
          <span class="icon is-small">
            <i class="fas fa-sync-alt"></i>
          </span>
          <span>Refresh</span>
        </button>
      </div>
    </section>

    <section class="timeline-shell"
             :class="{'is-loading': $apollo.queries.timelineItems && $apollo.queries.timelineItems.loading}">
      <div v-if="filteredItems.length"
           class="timeline-scroll">
        <div class="time-axis"
             :style="axisStyle">
          <span v-for="tick in ticks"
                :key="tick.label"
                :style="{ left: tick.left + '%' }">
            {{ tick.label }}
          </span>
        </div>

        <div v-for="lane in lanes"
             :key="lane.name"
             class="timeline-lane">
          <div class="lane-label">
            <strong>{{ lane.name }}</strong>
            <span>{{ lane.items.length }}</span>
          </div>
          <div class="lane-track"
               :style="axisStyle">
            <button v-for="item in lane.items"
                    :key="item.id"
                    type="button"
                    class="timeline-item"
                    :class="{'is-selected': selectedItem && selectedItem.id === item.id}"
                    :style="itemStyle(item)"
                    @click="selectedItem = item">
              <span class="item-time">{{ formatTime(item.start) }}</span>
              <span class="item-title">{{ item.title }}</span>
            </button>
          </div>
        </div>
      </div>

      <div v-else
           class="timeline-empty">
        <span class="icon is-large">
          <i class="fas fa-stream fa-2x"></i>
        </span>
        <h2 class="title is-5">No timeline items yet</h2>
        <p>As exercise activity is created, it will appear here grouped by source.</p>
      </div>
    </section>

    <aside v-if="selectedItem"
           class="timeline-detail">
      <div>
        <p class="overline">{{ selectedItem.lane }}</p>
        <h2 class="title is-4">{{ selectedItem.title }}</h2>
        <p class="timeline-detail-time">{{ formatDateTime(selectedItem.start) }}</p>
      </div>
      <p v-if="selectedItem.summary"
         class="timeline-detail-summary">{{ selectedItem.summary }}</p>
      <dl>
        <template v-if="selectedItem.actor">
          <dt>Actor</dt>
          <dd>{{ selectedItem.actor }}</dd>
        </template>
        <template v-if="selectedItem.status">
          <dt>Status</dt>
          <dd>{{ selectedItem.status }}</dd>
        </template>
      </dl>
      <button v-if="selectedItem.routePath"
              type="button"
              class="button is-primary is-small"
              @click="openSelectedItem">
        <span>Open source</span>
        <span class="icon is-small">
          <i class="fas fa-arrow-right"></i>
        </span>
      </button>
    </aside>
  </div>
</template>

<script>
import moment from 'moment'
import { ExerciseTimelineItems } from '@/timeline/graphql/Timeline.gql'

const SOURCE_OPTIONS = [
  { value: 'PLAN_EVENT', label: 'Events', accent: '#38bdf8' },
  { value: 'PLAN_INJECT', label: 'Injects', accent: '#f59e0b' },
  { value: 'COMMAND', label: 'Commands', accent: '#ef4444' },
  { value: 'OBSERVE', label: 'Observe', accent: '#22c55e' },
  { value: 'MEDIA', label: 'Media', accent: '#8b5cf6' },
  { value: 'CHAT', label: 'Chat', accent: '#14b8a6' }
]

export default {
  name: 'TimelineHome',
  apollo: {
    timelineItems: {
      query: ExerciseTimelineItems,
      variables() {
        return {
          sources: this.selectedSources,
          first: 180
        }
      },
      update(data) {
        return data.exerciseTimelineItems || []
      },
      error(error) {
        console.error(error)
      }
    }
  },
  data() {
    return {
      timelineItems: [],
      selectedSources: SOURCE_OPTIONS.map(source => source.value),
      selectedItem: null,
      sourceOptions: SOURCE_OPTIONS
    }
  },
  computed: {
    filteredItems() {
      return (this.timelineItems || [])
        .filter(item => this.selectedSources.includes(item.source))
        .filter(item => item.start)
    },
    lanes() {
      const groups = this.filteredItems.reduce((result, item) => {
        if (!result[item.lane]) result[item.lane] = []
        result[item.lane].push(item)
        return result
      }, {})

      return Object.keys(groups).map(name => ({
        name,
        items: groups[name].sort((a, b) => new Date(a.start) - new Date(b.start))
      }))
    },
    minTime() {
      if (!this.filteredItems.length) return Date.now()
      return Math.min(...this.filteredItems.map(item => new Date(item.start).getTime()))
    },
    maxTime() {
      if (!this.filteredItems.length) return Date.now()
      return Math.max(...this.filteredItems.map(item => {
        return new Date(item.end || item.start).getTime()
      }))
    },
    timeRange() {
      return Math.max(this.maxTime - this.minTime, 60 * 60 * 1000)
    },
    axisWidth() {
      return Math.max(1100, this.filteredItems.length * 54)
    },
    axisStyle() {
      return {
        width: `${this.axisWidth}px`
      }
    },
    ticks() {
      if (!this.filteredItems.length) return []
      const count = 6
      return Array.from({ length: count }).map((value, index) => {
        const ratio = count === 1 ? 0 : index / (count - 1)
        const tick = this.minTime + this.timeRange * ratio
        return {
          left: ratio * 100,
          label: moment(tick).format('MMM D HH:mm')
        }
      })
    }
  },
  watch: {
    filteredItems(items) {
      if (!items.length) {
        this.selectedItem = null
      } else if (!this.selectedItem || !items.find(item => item.id === this.selectedItem.id)) {
        this.selectedItem = items[0]
      }
    }
  },
  methods: {
    toggleSource(source) {
      if (this.selectedSources.includes(source)) {
        this.selectedSources = this.selectedSources.filter(item => item !== source)
      } else {
        this.selectedSources = [...this.selectedSources, source]
      }
    },
    selectAllSources() {
      this.selectedSources = SOURCE_OPTIONS.map(source => source.value)
    },
    refreshTimeline() {
      if (this.$apollo.queries.timelineItems) {
        this.$apollo.queries.timelineItems.refetch()
      }
    },
    chipStyle(source) {
      return {
        '--timeline-accent': source.accent
      }
    },
    itemStyle(item) {
      const start = new Date(item.start).getTime()
      const end = new Date(item.end || item.start).getTime()
      const left = ((start - this.minTime) / this.timeRange) * 100
      const width = Math.max(((end - start) / this.timeRange) * 100, 7)

      return {
        '--timeline-accent': item.accent || '#38bdf8',
        left: `${Math.min(Math.max(left, 0), 96)}%`,
        width: `${Math.min(width, 28)}%`
      }
    },
    formatTime(value) {
      return moment(value).format('HH:mm')
    },
    formatDateTime(value) {
      return moment(value).format('MMM D, YYYY HH:mm')
    },
    openSelectedItem() {
      if (this.selectedItem && this.selectedItem.routePath) {
        this.$router.push(this.selectedItem.routePath)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.timeline-page {
  min-height: calc(100vh - 3.75rem);
  padding: 2rem;
  background:
    linear-gradient(180deg, rgba(56, 189, 248, 0.08), transparent 24rem),
    var(--epic-bg);
  color: var(--epic-text);
}

.timeline-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.25rem;

  .title,
  .subtitle {
    color: var(--epic-text);
    margin-bottom: 0.25rem;
  }

  .subtitle {
    color: var(--epic-muted);
  }
}

.overline {
  color: var(--epic-accent-strong);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0;
  margin-bottom: 0.35rem;
  text-transform: uppercase;
}

.timeline-stats {
  display: flex;
  gap: 0.75rem;

  div {
    min-width: 6rem;
    padding: 0.75rem 1rem;
    background: var(--epic-surface-raised);
    border: 1px solid var(--epic-border);
    border-radius: var(--epic-radius-md);
    box-shadow: var(--epic-shadow-sm);
  }

  span,
  small {
    display: block;
  }

  span {
    font-size: 1.35rem;
    font-weight: 800;
  }

  small {
    color: var(--epic-muted);
    font-weight: 700;
  }
}

.timeline-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.source-filters,
.toolbar-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.source-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 2.25rem;
  padding: 0 0.85rem;
  background: var(--epic-surface-raised);
  border: 1px solid var(--epic-border);
  border-radius: 999px;
  color: var(--epic-muted);
  cursor: pointer;
  font-weight: 800;
  transition: background-color var(--epic-motion), border-color var(--epic-motion), color var(--epic-motion), transform var(--epic-motion);

  .source-dot {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 999px;
    background: var(--timeline-accent);
  }

  &.is-active {
    background: color-mix(in srgb, var(--timeline-accent) 14%, var(--epic-surface-raised));
    border-color: var(--timeline-accent);
    color: var(--epic-text);
  }

  &:hover {
    transform: translateY(-1px);
  }
}

.timeline-shell {
  position: relative;
  overflow: hidden;
  min-height: 26rem;
  background: var(--epic-surface-raised);
  border: 1px solid var(--epic-border);
  border-radius: var(--epic-radius-lg);
  box-shadow: var(--epic-shadow-md);

  &.is-loading::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(125, 211, 252, 0.08), transparent);
    animation: timeline-loading 1.4s infinite;
    pointer-events: none;
  }
}

.timeline-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 1.5rem 1.5rem 1.75rem;
}

.time-axis {
  position: relative;
  height: 2.5rem;
  margin-left: 9.5rem;
  color: var(--epic-muted);
  font-size: 0.78rem;
  font-weight: 800;

  span {
    position: absolute;
    top: 0.25rem;
    transform: translateX(-50%);
    white-space: nowrap;
  }

  &::before {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0.45rem;
    left: 0;
    height: 1px;
    background: var(--epic-border);
  }
}

.timeline-lane {
  display: flex;
  align-items: stretch;
  min-height: 5.5rem;
  border-top: 1px solid var(--epic-border);
}

.lane-label {
  flex: 0 0 9.5rem;
  padding: 1rem 1rem 1rem 0;
  color: var(--epic-text);

  strong,
  span {
    display: block;
  }

  span {
    color: var(--epic-muted);
    font-size: 0.78rem;
    font-weight: 800;
    margin-top: 0.2rem;
  }
}

.lane-track {
  position: relative;
  min-height: 5.5rem;
  background:
    repeating-linear-gradient(
      90deg,
      transparent 0,
      transparent 9.8rem,
      var(--epic-border) 9.85rem,
      transparent 9.9rem
    );
}

.timeline-item {
  position: absolute;
  top: 1rem;
  min-width: 9rem;
  max-width: 18rem;
  height: 3.55rem;
  padding: 0.55rem 0.7rem;
  background: var(--epic-surface);
  border: 1px solid color-mix(in srgb, var(--timeline-accent) 54%, var(--epic-border));
  border-left: 4px solid var(--timeline-accent);
  border-radius: var(--epic-radius-md);
  box-shadow: var(--epic-shadow-sm);
  color: var(--epic-text);
  cursor: pointer;
  overflow: hidden;
  text-align: left;
  transition: border-color var(--epic-motion), box-shadow var(--epic-motion), transform var(--epic-motion);

  &:hover,
  &.is-selected {
    border-color: var(--timeline-accent);
    box-shadow: var(--epic-shadow-md);
    transform: translateY(-1px);
  }
}

.item-time,
.item-title {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-time {
  color: var(--epic-muted);
  font-family: monospace;
  font-size: 0.72rem;
  font-weight: 800;
}

.item-title {
  font-weight: 800;
  margin-top: 0.15rem;
}

.timeline-empty {
  display: grid;
  min-height: 26rem;
  place-items: center;
  align-content: center;
  gap: 0.65rem;
  padding: 2rem;
  text-align: center;

  .icon,
  p {
    color: var(--epic-muted);
  }

  .title {
    color: var(--epic-text);
    margin-bottom: 0;
  }
}

.timeline-detail {
  display: grid;
  grid-template-columns: minmax(12rem, 1fr) minmax(14rem, 2fr) auto;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
  padding: 1rem;
  background: var(--epic-surface-raised);
  border: 1px solid var(--epic-border);
  border-radius: var(--epic-radius-lg);
  box-shadow: var(--epic-shadow-sm);

  .title {
    color: var(--epic-text);
    margin-bottom: 0.25rem;
  }

  dl {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.15rem 0.75rem;
    margin: 0;
  }

  dt {
    color: var(--epic-muted);
    font-weight: 800;
  }

  dd {
    margin: 0;
    color: var(--epic-text);
  }
}

.timeline-detail-time,
.timeline-detail-summary {
  color: var(--epic-muted);
}

.timeline-detail-summary {
  margin: 0;
}

@keyframes timeline-loading {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(100%);
  }
}

@media screen and (max-width: 900px) {
  .timeline-page {
    padding: 1rem;
  }

  .timeline-header,
  .timeline-toolbar,
  .timeline-detail {
    align-items: stretch;
    flex-direction: column;
  }

  .timeline-detail {
    display: flex;
  }
}
</style>
