<template>
  <div class="epic-rich-text-editor">
    <div class="epic-rich-text-toolbar"
         role="toolbar">
      <button v-for="button in toolbarButtons"
              :key="button.command"
              class="button is-small"
              type="button"
              :title="button.title"
              @mousedown.prevent
              @click="format(button.command, button.value)">
        {{ button.label }}
      </button>
      <select class="select is-small"
              title="Heading"
              @change="formatBlock($event.target.value)">
        <option value="div">Normal</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>
    </div>
    <div ref="editor"
         class="epic-rich-text-content"
         contenteditable="true"
         :data-placeholder="placeholder"
         @input="emitContent"
         @blur="emitContent"
         @paste="handlePaste"></div>
  </div>
</template>

<script>
const BLOCKED_TAGS = ['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED']

function sanitizeHtml(html) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html || '', 'text/html')
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT)
  const blocked = []

  while (walker.nextNode()) {
    const node = walker.currentNode
    if (BLOCKED_TAGS.includes(node.tagName)) {
      blocked.push(node)
      continue
    }
    Array.from(node.attributes).forEach(attribute => {
      const name = attribute.name.toLowerCase()
      const value = attribute.value.trim().toLowerCase()
      if (
        name.startsWith('on') ||
        ((name === 'href' || name === 'src') && value.startsWith('javascript:'))
      ) {
        node.removeAttribute(attribute.name)
      }
    })
  }

  blocked.forEach(node => node.remove())
  return doc.body.innerHTML
}

export default {
  name: 'rich-text-editor',
  props: {
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      toolbarButtons: [
        { command: 'bold', label: 'B', title: 'Bold' },
        { command: 'italic', label: 'I', title: 'Italic' },
        { command: 'underline', label: 'U', title: 'Underline' },
        { command: 'insertUnorderedList', label: 'Bullets', title: 'Bullet list' },
        { command: 'insertOrderedList', label: '1.', title: 'Numbered list' },
        { command: 'formatBlock', value: 'blockquote', label: 'Quote', title: 'Quote' },
        { command: 'createLink', label: 'Link', title: 'Link' }
      ]
    }
  },
  computed: {
    placeholder() {
      return this.options && this.options.placeholder ? this.options.placeholder : ''
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        this.$nextTick(() => {
          const editor = this.$refs.editor
          const safeValue = sanitizeHtml(value)
          if (editor && editor.innerHTML !== safeValue) {
            editor.innerHTML = safeValue
          }
        })
      }
    }
  },
  methods: {
    format(command, value) {
      if (command === 'createLink') {
        const href = window.prompt('Link URL')
        if (!href) return
        document.execCommand(command, false, href)
      } else if (command === 'formatBlock') {
        document.execCommand(command, false, value)
      } else {
        document.execCommand(command, false, value || null)
      }
      this.emitContent()
    },
    formatBlock(tag) {
      document.execCommand('formatBlock', false, tag)
      this.emitContent()
    },
    handlePaste(event) {
      event.preventDefault()
      const text = event.clipboardData.getData('text/plain')
      document.execCommand('insertText', false, text)
      this.emitContent()
    },
    emitContent() {
      const html = sanitizeHtml(this.$refs.editor ? this.$refs.editor.innerHTML : '')
      this.$emit('input', html)
      this.$emit('change', html)
    }
  }
}
</script>

<style scoped>
.epic-rich-text-editor {
  border: 1px solid #d8dee9;
  border-radius: 4px;
  background: #fff;
}

.epic-rich-text-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  align-items: center;
  padding: 0.35rem;
  border-bottom: 1px solid #d8dee9;
  background: #f7f9fb;
}

.epic-rich-text-toolbar .button {
  min-width: 2rem;
}

.epic-rich-text-toolbar .select {
  width: auto;
  height: 2rem;
}

.epic-rich-text-content {
  min-height: 10rem;
  padding: 0.75rem;
  outline: none;
}

.epic-rich-text-content:empty::before {
  content: attr(data-placeholder);
  color: #7a7a7a;
}
</style>
