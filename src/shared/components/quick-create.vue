<template>
  <div>
    <b-dropdown :position="position">
      <a :class="'button '+ colorBtn+ ' '+sizeBtn"
         slot="trigger"
         slot-scope="{ active }">
        <span class="icon">
          <i :class="mainBtn"></i>
        </span>
        <span>Create</span>
        <span class="icon"
              v-if="active"
              :key="active">
          <i class="fas fa-angle-up"></i>
        </span>
        <span class="icon"
              v-else>
          <i class="fas fa-angle-down"></i>
        </span>
      </a>
      <template v-if="area=='plan' || area == 'all'">
        <b-dropdown-item @click="openDialog('inject')">
          <span>New Inject</span>
        </b-dropdown-item>
        <b-dropdown-item @click="openDialog('participant')">
          <span>New Participant</span>
        </b-dropdown-item>
        <b-dropdown-item @click="openDialog('trainingObjective')">
          <span>New Training Objective</span>
        </b-dropdown-item>
      </template>
      <template v-if="area=='media' || area ==  'all'">
        <b-dropdown-item @click="openDialog('post', true)">
          <span>New Post</span>
        </b-dropdown-item>
        <b-dropdown-item @click="openDialog('profile', true)">
          <span>New Profile</span>
        </b-dropdown-item>
        <b-dropdown-item @click="openDialog('persona', true)">
          <span>New Persona</span>
        </b-dropdown-item>
        <b-dropdown-item @click="openDialog('network', true)">
          <span>New Network</span>
        </b-dropdown-item>
        <b-dropdown-item @click="openDialog('sites', true)">
          <span>New Site</span>
        </b-dropdown-item>
      </template>
    </b-dropdown>
    <template v-if="area=='plan' || area == 'all'">
      <JMETQuickAdd :open="showPlanInject"
                    :planInject="planInject"
                    :fullCreate='true'
                    @close="closeDialog('inject')" />
      <Participant-QuickAdd :open="showParticipant"
                            @close="closeDialog('participant')" />
      <TrainingObjective-QuickAdd :open="showTrainingObj"
                                  @close="closeDialog('trainingObjective')" />
    </template>
    <template v-if="area=='media' || area ==  'all'">
      <profile-select-modal v-if="showPost"
                            :open="showPost"
                            @select="createMediaPost($event)"
                            @close="closeDialog('post')" />
      <profile-create v-if="showProfile"
                      :open="showProfile"
                      @close="closeDialog('profile')" />
      <persona-create v-if="showPersona"
                      :open="showPersona"
                      @close="closeDialog('persona')" />
      <network-create v-if="showNetwork"
                      :open="showNetwork"
                      @close="closeDialog('network')" />
      <site-create :open="showSites"
                   :mediaService="selectedService"
                   @close="closeDialog('sites')" />
    </template>
  </div>
</template>

<script>
import JMETQuickAdd from '@/plan/components/jmet-quickadd'
import ParticipantQuickAdd from '@/plan/components/participant-quickadd'
import TrainingObjectiveQuickAdd from '@/plan/components/trainingObjective-quickadd'
import ProfileSelectModal from '@/shared/components/profile-selectModal'
import ProfileCreate from '@/media/components/profile-create'
import PersonaCreate from '@/media/components/personas-create'
import NetworkCreate from '@/media/components/network-create'
import SiteCreate from '@/media/components/site-create'

import mediaPost from '@/shared/mixins/mediaPost'

import PlanInject from '@/plan/model/planinject'
import MediaService from '@/media/model/mediaservice'

export default {
  name: 'quick-create',
  props: {
    position: {
      type: String,
      default: null
    },
    colorBtn: {
      type: String,
      default: 'is-primary'
    },
    sizeBtn: {
      type: String,
      default: ''
    },
    mainBtn: {
      type: String,
      default: 'fas fa-plus-square'
    },
    area: {
      type: String,
      default: ''
    }
  },
  mixins: [mediaPost],
  components: {
    JMETQuickAdd,
    ParticipantQuickAdd,
    TrainingObjectiveQuickAdd,
    ProfileSelectModal,
    ProfileCreate,
    PersonaCreate,
    NetworkCreate,
    SiteCreate
  },
  data() {
    return {
      selectedService: new MediaService(),
      showPlanInject: false,
      planInject: new PlanInject(),
      showParticipant: false,
      showTrainingObj: false,
      showPost: false,
      showProfile: false,
      showPersona: false,
      showNetwork: false,
      showSites: false
    }
  },
  methods: {
    openDialog(area) {
      switch (area) {
        case 'inject':
          return (this.showPlanInject = true)
        case 'participant':
          return (this.showParticipant = true)
        case 'trainingObjective':
          return (this.showTrainingObj = true)
        case 'post':
          //profile selector component
          return (this.showPost = true)
        case 'profile':
          return (this.showProfile = true)
        case 'persona':
          return (this.showPersona = true)
        case 'network':
          return (this.showNetwork = true)
        case 'sites':
          return (this.showSites = true)
      }
    },
    closeDialog(area) {
      switch (area) {
        case 'inject':
          return (this.showPlanInject = false)
        case 'participant':
          return (this.showParticipant = false)
        case 'trainingObjective':
          return (this.showTrainingObj = false)
        case 'post':
          //profile selector component
          return (this.showPost = false)
        case 'profile':
          return (this.showProfile = false)
        case 'persona':
          return (this.showPersona = false)
        case 'network':
          return (this.showNetwork = false)
        case 'sites':
          this.selectedService = new MediaService()
          return (this.showSites = false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
