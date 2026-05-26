import { mount } from '@vue/test-utils'
import RichTextEditor from '@/shared/components/rich-text-editor'

describe('rich-text-editor.vue', () => {
  it('sanitizes unsafe html from v-model values', async() => {
    const wrapper = mount(RichTextEditor, {
      propsData: {
        value: '<p onclick="alert(1)">Safe</p><script>alert(1)</script><a href="javascript:alert(1)">link</a>'
      }
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.epic-rich-text-content').html()).toContain('<p>Safe</p>')
    expect(wrapper.find('.epic-rich-text-content').html()).not.toContain('onclick')
    expect(wrapper.find('.epic-rich-text-content').html()).not.toContain('<script>')
    expect(wrapper.find('.epic-rich-text-content').html()).not.toContain('javascript:')
  })

  it('emits sanitized html when content changes', async() => {
    const wrapper = mount(RichTextEditor)
    const editor = wrapper.find('.epic-rich-text-content')

    editor.element.innerHTML = '<strong>Changed</strong><img src="javascript:alert(1)">'
    await editor.trigger('input')

    expect(wrapper.emitted().input[0][0]).toContain('<strong>Changed</strong>')
    expect(wrapper.emitted().input[0][0]).not.toContain('javascript:')
  })
})
