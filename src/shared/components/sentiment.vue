<template>
  <span v-if="result.comparative > 0"
        :title="'Sentiment: '+ result.comparative"
        :data-tooltip="'Sentiment: '+ result.comparative"
        class="has-text-success tooltip">😀 positive</span>
  <span v-else-if="result.comparative < 0"
        :title="'Sentiment: '+ result.comparative"
        :data-tooltip="'Sentiment: '+ result.comparative"
        class="has-text-danger tooltip">😟 negative</span>
  <span v-else
        :title="'Sentiment: '+ result.comparative"
        :data-tooltip="'Sentiment: '+ result.comparative"
        class="has-text-grey-light tooltip">😐 neutral</span>
</template>

<script>
import Sentiment from 'sentiment'
const sentiment = new Sentiment()

export default {
  name: 'sentiment',
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      result: sentiment.analyze(this.text.replace(/<(?:.|\n)*?>/gm, ''))
    }
  }
}
</script>
