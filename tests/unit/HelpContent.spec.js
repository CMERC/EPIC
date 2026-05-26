import { shallowMount } from '@vue/test-utils'
import HelpContent from '@/shared/components/helpcontent.vue'

describe('helpcontent.vue', () => {
  it('renders help when passed', () => {
    const reference = 'plan.train'
    const wrapper = shallowMount(HelpContent, {
      propsData: { reference }
    })
    expect(wrapper.text()).toMatch('MSEL Timeline')
  })
})
