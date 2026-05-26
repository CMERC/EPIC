<template>
  <div class="is-relative-mobile">
    <breadcrumb />
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <span class="button is-primary"
                @click="toggleQuickAdd(true)">Create MSEL Inject</span>
          <a class="card-header-icon"
             @click="toggleQuickAdd(false)">
            <span class="icon is-small">
              <i class="fas fa-plus"></i>
            </span>
          </a>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <div class="field has-addons"
               v-if="this.$route.name != 'msel-tracker'">
            <p class="control">
              <router-link :to="{ name: 'injects-list'}">
                <button class="button"
                        title="List">
                  <span class="icon is-small">
                    <i class="fas fa-align-justify has-text-grey"></i>
                  </span>
                </button>
              </router-link>
            </p>
            <p class="control">
              <router-link :to="{ name: 'injects-board'}">
                <button class="button"
                        title="Board">
                  <span class="icon is-small">
                    <i class="fas fa-columns has-text-grey"></i>
                  </span>
                </button>
              </router-link>
            </p>
            <p class="control">
              <router-link :to="{ name: 'injects-calendar'}">
                <button class="button"
                        title="Calendar">
                  <span class="icon is-small">
                    <i class="fas fa-calendar-alt has-text-grey"></i>
                  </span>
                </button>
              </router-link>
            </p>
          </div>
        </div>
        <div class="level-item">
          <div class="field">
            <p class="control has-icons-left has-icons-right">
              <input class="input is-rounded is-primary"
                     type="text"
                     placeholder="Search..."
                     v-model.lazy="searchQuery">
              <span class="icon is-small is-left">
                <i class="fas fa-search"></i>
              </span>
              <span class="icon is-small is-right"
                    @click="searchQuery = ''">
                <i class="fas fa-times-circle"></i>
              </span>
            </p>
          </div>
        </div>
        <div class="level-item">
          <help-content :reference="'plan.prepare.injects'"
                        toggle
                        dropdown />
        </div>
      </div>
    </nav>
    <nav class="level">
      <div class="level-left">
        <div class="level-item"></div>
      </div>
      <div class="level-right">
        <div class="level-item"
             v-if="planEvents">
          <div class="select">
            <select v-model="eventName">
              <option value="">
                All Events
              </option>
              <option disabled>
                ──────────
              </option>
              <option v-for="event in planEvents"
                      v-bind:key="event.id"
                      :value="event.name">
                {{truncate(event.name, 25)}}
              </option>
            </select>
          </div>
        </div>
        <div class="level-item">
          <div class="select">
            <select v-model="selectedBoard"
                    @change="optionBoard(selectedBoard)">
              <option v-for="board in planLabelGroups"
                      :key="board.id"
                      :value="board.title">
                {{board.title}}
              </option>
              <option disabled>
                ──────────
              </option>
              <option value="manage">
                ✏️ Manage Boards
              </option>
            </select>
          </div>
        </div>
      </div>
    </nav>
    <div class="boards-container"
         id="boards-container">
      <div class="columns is-variable is-2 is-mobile"
           v-if="planInjectsSearch && planInjectsSearch.length > 0">
        <div id="chevRight" >
          <span class="icon">
            <i class="fas fa-chevron-right"></i>
          </span>
        </div>
        <div class="column is-3-desktop is-3-tablet is-8-mobile board"
             v-for="(injectLabel, value, index) in allInjectsByLabel"
             :key="index">
          <div class="card">
            <header class="card-header"
                    :style="'background-color:'+injectLabel.label.color"
                    :class="lightOrDark(injectLabel.label.color)">
              <p class="card-header-title">{{injectLabel.title}}</p>
              <p class="card-header-icon has-text-weight-bold">{{formatNumber(injectLabel.injects.length, 'thousands')}}</p>
            </header>
            <div class="card-content"
                 v-if="injectLabel.injects">
              <draggable v-model="injectLabel.injects"
                         :options="dragOptions(injectLabel,index)"
                         :move="onMove"
                         @start="isDragging=true"
                         @end="isDragging=false"
                         @add="updateLabel()">
                <transition-group :style="{'min-height': `calc(100vh - 300px)`}"
                                  type="transition"
                                  :name="'my'+injectLabel+'-list'"
                                  class="trans-group">
                  <div class="columns is-mobile is-marginless is-paddingless"
                       v-for="inject in injectLabel.injects"
                       v-bind:key="inject.id"
                       @click="previewInject(inject)">
                    <div class="column is-12 is-paddingless">
                      <div class="card inject"
                           :class="{'has-ribbon-bottom is-small': isInjectPastDue(inject, inject.status), 'has-ribbon-bottom is-small': injectAlertChecker(inject, inject.status)}">
                        <div class="ribbon is-small is-danger"
                             v-if="isInjectPastDue(inject, inject.status)">
                          Past Due
                        </div>
                        <div class="ribbon is-small is-warning"
                             :class="{'tooltip': injectAlertChecker(inject, inject.status)}"
                             data-tooltip="Edit Date and Time"
                             v-if="injectAlertChecker(inject, inject.status)">
                          Alert
                        </div>
                        <div class="media">
                          <div class="media-left">
                            <span class="has-text-black is-6 inject-info has-text-weight-semibold">#{{inject.number}} </span>
                          </div>
                          <div class="media-content">
                            <span class="tooltip has=text-black has-text-weight-semibold is-tooltip-bottom"
                                  :data-tooltip="formatDate(inject.startDate, 'utc-dtg')">{{ formatDate(inject.startDate, 'dtg') }}</span>
                          </div>
                        </div>
                        <div class="content">
                          <p class="title is-6 inject-info"> {{inject.title}}</p>
                          <span class="tag event is-rounded tooltip is-tooltip-bottom"
                                v-if="inject.events"
                                :data-tooltip="inject.events.name"
                                :style="'background-color:'+inject.events.color"
                                :class="lightOrDark(inject.events.color)">{{inject.events.name | truncate(25)}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition-group>
              </draggable>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <empty-state :data="planInjectsSearch"
                     :search="searchQuery ? true : false"
                     :isLoading='$apollo.loading'>
          <template slot="action-buttons">
            <div class="buttons is-centered is-spaced">
              <span class="button is-primary"
                    @click="toggleQuickAdd(true)">Create MSEL Inject</span>
            </div>
          </template>
        </empty-state>
      </div>
    </div>
    <inject-preview :open="previewModal"
                    :id="selectedInject"
                    @close="closeModal"></inject-preview>
    <JMETQuickAdd :open="quickAdd"
                  :planInject="planInject"
                  :fullCreate="fullCreate"
                  @close="close"></JMETQuickAdd>
  </div>
</template>
<script>
import injectStatusCheck from '@/shared/mixins/injectStatusCheck'
import {
  PlanEventsSelector,
  PlanEventSubscription
} from '@/plan/graphql/PlanEvents.gql'
import JMETQuickAdd from '@/plan/components/jmet-quickadd'
import HelpContent from '@/shared/components/helpcontent'
import {
  PlanInjectsDelete,
  PlanInjectsSearch,
  PlanInjectsUpdate,
  PlanInjectsSearchSubscription
} from '@/plan/graphql/PlanInjects.gql'
import { PlanLabelGroupsRead } from '@/plan/graphql/PlanLabelGroups.gql'
import InjectPreview from '@/plan/components/inject-preview'
import draggable from 'vuedraggable'
import helpers from '@/shared/mixins/helpers'
import lightOrDark from '@/shared/mixins/lightOrDark'
import PlanInject from '@/plan/model/planinject'
export default {
  name: 'injects-board',
  mixins: [helpers, lightOrDark, injectStatusCheck],
  components: {
    JMETQuickAdd,
    draggable,
    InjectPreview,
    HelpContent
  },
  apollo: {
    planLabelGroups: {
      query: PlanLabelGroupsRead,
      update(data) {
        if (data && data.planLabelGroups && data.planLabelGroups.length) {
          if (!this.selectedBoard) {
            this.selectedBoard = data.planLabelGroups[0].title
          }
          return data.planLabelGroups
        }
      }
    },
    selectedPlanLabelGroups: {
      query: PlanLabelGroupsRead,
      variables() {
        return {
          where: {
            title: this.selectedBoard || null
          }
        }
      },
      update(data) {
        if (data && data.planLabelGroups && data.planLabelGroups.length) {
          this.displayGroup = data.planLabelGroups[0]
          let tempObj = {}
          let tempArray = []
          // Using this method to update display label only when all process are finished
          let holdingObj = {}
          for (let i in this.displayGroup.groupLabels) {
            let tempLabel = this.displayGroup.groupLabels[i]
            tempObj[tempLabel.title] = {
              title: tempLabel.title,
              label: tempLabel,
              injects: []
            }
            tempArray.push(Object.assign({}, tempObj))
          }
          let tempL = tempArray.length
          holdingObj = tempArray[tempL - 1]
          Object.keys(holdingObj).forEach(key => {
            holdingObj[key].injects = this.allPlanInjects.filter(inject => {
              return (
                inject.status &&
                inject.status.title === key &&
                inject.deletedAt === null
              )
            })
          })
          this.allInjectsByLabel = holdingObj
        }
        return data.planLabelGroups
      },
      error(error) {
        console.error(error)
      }
    },
    planInjectsSearch: {
      query: PlanInjectsSearch,
      variables() {
        return {
          event: this.eventName,
          query: this.searchQuery,
          orderBy: this.orderBy
        }
      },
      update(data) {
        if (data && data.planInjectsSearch) {
          this.allPlanInjects = JSON.parse(
            JSON.stringify(data.planInjectsSearch),
            this.omitTypename
          )
          if (this.allInjectsByLabel) {
            Object.keys(this.allInjectsByLabel).forEach(key => {
              if (key === 'Draft') {
                // Show injects with no status under draft board
                this.allInjectsByLabel[
                  key
                ].injects = this.allPlanInjects.filter(inject => {
                  return (
                    (!inject.status ||
                      (inject.status && inject.status.title === key)) &&
                    inject.deletedAt === null
                  )
                })
              } else
                this.allInjectsByLabel[
                  key
                ].injects = this.allPlanInjects.filter(inject => {
                  return (
                    inject.status &&
                    inject.status.title === key &&
                    inject.deletedAt === null
                  )
                })
            })
          }
          return data.planInjectsSearch
        }
      },
      error(error) {
        console.error(error)
      },
      subscribeToMore: {
        document: PlanInjectsSearchSubscription,
        // Mutate the previous result
        updateQuery() {
          this.refetchQuery()
        }
      }
    },
    planEvents: {
      query: PlanEventsSelector,
      variables: {
        where: {
          type: null
        }
      },
      subscribeToMore: [
        {
          document: PlanEventSubscription,
          variables: {
            node: {
              where: {
                type: null
              }
            }
          },
          // Mutate the previous result
          updateQuery(previousResult, { subscriptionData }) {
            // Mutation type
            let mutationIn = subscriptionData.data.planEvent.mutation
            let newResult
            switch (mutationIn) {
              case 'CREATED': {
                newResult = {
                  planEvents: [
                    ...previousResult.planEvents,
                    subscriptionData.data.planEvent.node
                  ]
                }
                break
              }
              case 'DELETED': {
                newResult = {
                  planEvents: [
                    ...previousResult.planEvents.filter(
                      obj =>
                        subscriptionData.data.planEvent.previousValues.id !==
                        obj.id
                    )
                  ]
                }
                break
              }
              case 'UPDATED': {
                let updatedPlanEvents = JSON.parse(
                  JSON.stringify(previousResult.planEvents)
                )
                let index = updatedPlanEvents.findIndex(
                  x => x.id === subscriptionData.data.planEvent.node.id
                )
                updatedPlanEvents[index] = subscriptionData.data.planEvents.node
                newResult = {
                  planEvents: updatedPlanEvents
                }
                break
              }
              default: {
                throw new Error(`Unknown Subscription Mutation`)
              }
            }
            // Here, return the new result from the previous with the new data
            return newResult
          }
        }
      ]
    }
  },
  data() {
    return {
      orderBy: 'startDate_ASC',
      eventName: this.$route.query.eventName || '',
      searchQuery: this.$route.query.q || '',
      selectedBoard: this.$route.query.b,
      fullCreate: false,
      allInjectsByLabel: {},
      planInjects: [],
      allPlanInjects: [],
      allPlanLabels: [],
      quickAdd: false,
      planInject: new PlanInject(),
      editable: true,
      isDragging: false,
      delayedDragging: false,
      dropColumn: '',
      dropInject: '',
      selectedInject: null,
      previewModal: false,
      dropLabel: '',
      isLabelGroupOpen: false,
      displayGroup: {
        title: ''
      },
      dateConfig: {
        enableTime: true,
        altInput: true,
        altFormat: 'd M y H:i (Z)',
        dateFormat: 'Z'
      }
    }
  },
  watch: {
    $route() {
      this.selectedBoard = this.$route.query.b
    },
    eventName() {
      this.$router.push({
        query: Object.assign({}, this.$route.query, {
          eventName: this.eventName
        })
      })
    },
    selectedBoard() {
      this.$router.push({
        query: Object.assign({}, this.$route.query, { b: this.selectedBoard })
      })
    },
    searchQuery() {
      this.$router.push({
        query: Object.assign({}, this.$route.query, { q: this.searchQuery })
      })
    }
  },
  methods: {
    refetchQuery() {
      this.$apollo.queries.planInjectsSearch.refetch()
    },
    handleScroll(event) {
      let chevRight = document.getElementById('chevRight')
      if (event.target.scrollLeft <= 0) {
        chevRight.style.display = 'flex'
      } else {
        chevRight.style.display = 'none'
      }
    },
    optionBoard(board) {
      if (board === 'manage') {
        this.$router.push({
          name: 'planBoards'
        })
      }
    },
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      this.dropColumn = relatedContext.component.options.name
      this.dropInject = draggedContext.element
      this.dropLabel = JSON.parse(
        JSON.stringify(relatedContext.component.options.label),
        this.omitTypename
      )
      return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
    },
    dragOptions(dragGroup, idx) {
      return {
        animation: 150,
        group: 'allInjects',
        disabled: false,
        ghostClass: 'sortable-ghost',
        name: dragGroup.title,
        label: dragGroup.label,
        chosenClass: 'sortable-chosen',
        fallbackTolerance: 5,
        groupIndex: idx
      }
    },
    updateLabel() {
      try {
        this.$apollo
          .mutate({
            mutation: PlanInjectsUpdate,
            variables: {
              data: {
                status: {
                  connect: { title: this.dropLabel.title }
                }
              },
              where: {
                id: this.dropInject.id
              }
            }
          })
          .then(response => {
            this.injectStatusCheck(this.dropInject, this.dropLabel)
            this.injectAlertChecker(this.dropInject, this.dropLabel)

            let injectID = response.data.updatePlanInject.id
            this.allInjectsByLabel[this.dropLabel.title].injects.forEach(
              (inject, idx, array) => {
                if (inject.id === injectID) {
                  array[idx].status.color = this.dropLabel.color
                  array[idx].status.description = this.dropLabel.description
                  array[idx].status.title = this.dropLabel.title
                }
              }
            )
            this.$buefy.toast.open({
              message: 'Saving...',
              type: 'is-success'
            })
          })
          .catch(error => {
            this.$buefy.toast.open({
              message: error.message,
              type: 'is-danger'
            })
          })
      } catch (error) {
        this.$buefy.toast.open({
          message: error.message,
          type: 'is-danger'
        })
      }
    },
    previewInject(inject) {
      this.previewModal = true
      this.selectedInject = inject.id
    },
    closeModal() {
      this.previewModal = false
      this.selectedInject = null
    },
    editPlanInject(number) {
      this.$router.push({
        name: 'planInjectView',
        params: { number: number },
        query: { from: this.$route.fullPath }
      })
    },
    close() {
      this.quickAdd = false
      this.fullCreate = false
      this.errors.clear()
      this.$validator.reset()
      this.planInject = new PlanInject()
    },
    toggleQuickAdd(fullValue) {
      this.quickAdd = true
      this.errors.clear()
      this.$validator.reset()
      this.planInject = new PlanInject()
      if (fullValue) {
        this.fullCreate = fullValue
      }
    },
    confirmDelete(inject) {
      this.$buefy.dialog.confirm({
        title: 'Delete Inject',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteInject(inject)
      })
    },
    deleteInject(inject) {
      this.$apollo
        .mutate({
          mutation: PlanInjectsDelete,
          variables: {
            id: {
              id: inject
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Inject Deleted!',
            type: 'is-success'
          })
          this.$apollo.queries.planInjects.refetch()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Inject Deleted: ' + error)
        })
    },
    undoDelete(injectId) {
      this.$apollo
        .mutate({
          mutation: PlanInjectsUpdate,
          variables: {
            data: {
              deletedAt: null
            },
            where: {
              id: injectId
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Saving...',
            type: 'is-success'
          })
          this.$apollo.queries.planInjects.refetch()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Inject updated: ' + error)
        })
    }
  },
  mounted() {
    let boardsWrapper = document.getElementById('boards-container')
    if (boardsWrapper) {
      boardsWrapper.addEventListener('scroll', this.handleScroll)
    }
  },
  destroyed() {
    let boardsWrapper = document.getElementById('boards-container')
    if (boardsWrapper) {
      boardsWrapper.removeEventListener('scroll', this.handleScroll)
    }
  }
}
</script>

<style lang="scss" scoped>
.ribbon {
  &.tooltip {
    position: absolute;
  }
}
#chevRight {
  background-color: rgba(231, 217, 217, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 25px;
  position: absolute;
  z-index: 1;
  right: 0;
  top: 0;
  .icon {
    vertical-align: middle;
  }
}
@media screen and (min-width: 1088px) {
  #chevRight {
    height: 600px;
    .icon {
      vertical-align: middle;
    }
  }

  .board {
    width: 26%;
  }
}

.boards-container {
  position: relative;
  overflow: scroll;
  .card {
    height: 100%;
    .media:not(:last-child) {
      margin-bottom: 0;
    }
    .card-header {
      border-radius: 0.4em 0.4em 0em 0em;
    }
    .card-header-title {
      color: #fff;
    }
    .card-content {
      max-height: calc(100vh - 275px);
      overflow-y: scroll;
      padding: 0.5rem;
      .content p:not(:last-child) {
        margin-bottom: 0;
      }
      .trans-group {
        min-height: 20px;
        display: block;
        padding-block-end: 1rem;
        .sortable-chosen {
          background-color: rgb(80, 82, 81);
        }
        .sortable-ghost {
          opacity: 0.4;
        }
        .inject {
          background-color: #fff;
          color: #000;
          border-radius: 4px;
          margin: 0.25em;
          padding: 0.5em;
          .inject-info {
            cursor: pointer;
            &:hover {
              text-decoration: underline;
            }
          }
          .event {
            cursor: default;
            &:hover {
              text-decoration: none;
            }
            .tooltip {
              width: auto;
            }
          }
        }
      }
      .inject-deleted {
        background: #cccccc;
      }
      .label-edit-button {
        cursor: pointer;
      }
    }
  }
}
</style>
