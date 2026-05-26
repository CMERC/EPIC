import Vue from 'vue'
import Router from 'vue-router'

import NoNavDash from './shared/views/NoNavDash.vue'

// Main App
import MainDashboard from './shared/views/Dashboard.vue'
import Home from './shared/views/Home.vue'

// Settings
import SettingsDashboard from './admin/views/Dashboard.vue'
import SettingsPlanHome from './admin/views/plan/PlanSettingsHome.vue'
import SettingsMediaHome from './admin/views/media/MediaSettingsHome.vue'
import SettingsGeneralHome from './admin/views/general/GeneralSettingsHome.vue'
import SettingsWorkspaceHome from './admin/views/workspace/WorkspaceSettingsHome.vue'
import UserSettings from './admin/views/general/Settings.vue'
import WorkspaceMembers from './admin/views/workspace/WorkspaceMembers.vue'
import WorkspaceTimezone from './admin/views/workspace/WorkspaceTimezone.vue'
import WorkspaceApps from './admin/views/workspace/WorkspaceApps.vue'
import Status from './admin/views/plan/Status.vue'
import PlanJMETs from './admin/views/plan/JMETs.vue'
import PlanOrganizations from './admin/views/plan/Organizations.vue'
import PlanPlatforms from './admin/views/plan/Platforms.vue'
import PlanParticipantTypes from './admin/views/plan/ParticipantTypes.vue'
import PlanJointStaffTrainingPriorities from './admin/views/plan/JointStaffTrainingPriorities.vue'
import PlanReasons from './admin/views/plan/Reasons.vue'
import PlanPriorityLevels from './admin/views/plan/TrainingPriority.vue'
import Boards from './admin/views/plan/Boards.vue'
import Methods from './admin/views/plan/Methods.vue'
import ServiceDepartmentType from './admin/views/plan/ServiceDepartmentType.vue'
import CommandAgencies from './admin/views/plan/CommandAgencies.vue'
import ServiceDepartment from './admin/views/plan/ServiceDepartment.vue'
import InjectOwners from './admin/views/plan/InjectOwners.vue'

// Media App
import MediaDashboard from './media/views/Dashboard.vue'
import MediaHome from './media/views/Home.vue'
import MediaProfilesHome from './media/views/profiles/ProfilesHome.vue'
import MediaPostsHome from './media/views/posts/PostsHome.vue'
import PersonasHome from './media/views/personas/PersonasHome.vue'
import NetworksHome from './media/views/networks/NetworksHome.vue'

// Plan App
import PlanDashboard from './plan/views/Dashboard.vue'
import PlanHome from './plan/views/Home.vue'
import PlanPrepareHome from './plan/views/prepare/PrepareHome.vue'
import PlanInjectsBoard from './plan/views/prepare/InjectsBoard.vue'
import PlanInjectsList from './plan/views/prepare/InjectsList.vue'
import PlanInjectView from './plan/views/prepare/Inject-view.vue'
import PlanTrainHome from './plan/views/train/TrainHome.vue'
import PlanInjectsCalendar from './plan/views/prepare/InjectsCalendar.vue'

// import PlanObjectiveStatus from './plan/views/train/ObjectiveStatus.vue'
import PlanPrepareDashboard from './plan/views/prepare/Dashboard.vue'
import PlanTrainDashboard from './plan/views/train/Dashboard.vue'
import PlanEventsCalendar from './plan/views/prepare/Events-Calendar.vue'
import PlanEvents from './plan/views/prepare/Events.vue'
import PlanEventView from './plan/views/prepare/Event-view.vue'
import PlanPrepareEdit from './plan/views/prepare/PrepareEdit.vue'
import PlanExerciseDetails from './plan/views/prepare/Exercise-Details.vue'
import PlanParticipants from './plan/views/prepare/Participants.vue'
import PlanExercise from './plan/components/prepare/manage-exercise.vue'
import PlanManageInject from './plan/components/prepare/manage-inject.vue'
import PlanCreateEvent from './plan/components/prepare/manage-event.vue'
import PlanManageParticipant from './plan/components/prepare/manage-participant.vue'
import PlanManageTrainingObjective from './plan/components/prepare/manage-trainingObjective.vue'

import PlanObjectivesList from './plan/views/prepare/ObjectivesList.vue'
import PlanParticipantView from './plan/views/prepare/Participant-view.vue'
import PlanParticipantHome from './plan/views/prepare/ParticipantsHome.vue'

import PlanAssessHome from './plan/views/assess/AssessHome.vue'
import PlanOverview from './plan/views/assess/Overview.vue'
import PlanAssessmentEdit from './plan/views/assess/assess-edit.vue'

import PlanAssesList from './plan/views/feedback/AssessList.vue'

import PlanFeedbackHome from './plan/views/feedback/FeedbackHome.vue'
import PlanFeedback from './plan/views/feedback/Feedback.vue'
import PlanFeedbackView from './plan/views/feedback/feedback-view.vue'

import PlanCollect from './plan/views/feedback/Collect.vue'

import PlanReportsHome from './plan/views/reports/ReportsHome.vue'
import PlanReportsExport from './plan/views/reports/Export.vue'
import PlanReports from './plan/views/reports/Reports.vue'
import PlanReportsList from './plan/views/reports/ReportsList.vue'

// Note App
import NoteDashboard from './note/views/Dashboard.vue'
import NoteHome from './note/views/Home.vue'
import NoteBookView from './note/views/NoteBookView.vue'
import NoteBookEdit from './note/views/NoteBookEdit.vue'
import NoteFolderEdit from './note/views/NoteFolderEdit.vue'

// Dev App
import DevDashboard from './dev/views/Dashboard.vue'
import DevHome from './dev/views/Home.vue'
import DevUsers from './dev/views/Users.vue'
import DevWorkspaces from './dev/views/Workspace.vue'
import Error404 from './shared/views/Error.vue'
import Forgot from './shared/views/Forgot.vue'
import Login from './shared/views/Login.vue'
import Register from './shared/views/Register.vue'
import RegisterInvite from './shared/views/RegisterInvite.vue'
import ConfirmEmail from './shared/views/ConfirmEmail.vue'
import Reset from './shared/views/Reset.vue'

// Map
import MapDashboard from './map/views/Dashboard.vue'
import MonitorMap from './map/views/Monitor.vue'
import MapHome from './map/views/MapHome.vue'

// Web
import WebDashboard from './web/views/Dashboard.vue'
import SocialMediaDashboard from './web/views/SocialMediaDashboard.vue'
import WebHome from './web/views/Home.vue'
import WebProfilesHome from './web/views/Profiles.vue'
import WebNewsHome from './web/views/News.vue'
import WebRouter from './web/views/web-router.vue'
import PostsOnService from './web/views/PostsOnService'
import PublicPlanFeedbackEdit from './web/views/feedback-edit'

// Chat
import ChatDashboard from './chat/views/Dashboard.vue'
import ChatHome from './chat/views/Home.vue'

// Email
import EmailDashboard from './email/views/Dashboard.vue'
import EmailHome from './email/views/Home.vue'

//Observe
import ObserveDashboard from './observe/views/Dashboard.vue'
import ObserveHome from './observe/views/Home.vue'
import ObservePost from './observe/views/Post.vue'
import ObserveProfile from './observe/views/Profile.vue'

//Observe
import ActivityDashboard from './activity/views/Dashboard.vue'
import ActivityHome from './activity/views/Home.vue'

//Learn
import LearnDashboard from './learn/views/Dashboard.vue'
import LearnHome from './learn/views/Home.vue'

//Resources
import ResourcesDashboard from './resources/views/Dashboard.vue'
import ResourcesHome from './resources/views/Home.vue'

//Command
import CommandDashboard from './command/views/Dashboard.vue'
import CommandHome from './command/views/Home.vue'

import { store } from '@/store'

Vue.use(Router)

function isDuplicateNavigationError(error) {
  const duplicateType = Router.NavigationFailureType && Router.NavigationFailureType.duplicated
  return error && (
    error.name === 'NavigationDuplicated' ||
    error._name === 'NavigationDuplicated' ||
    error.type === duplicateType ||
    /Avoided redundant navigation/.test(error.message || '')
  )
}

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }

  return originalPush.call(this, location).catch(error => {
    if (isDuplicateNavigationError(error)) {
      return this.currentRoute
    }
    throw error
  })
}

const originalReplace = Router.prototype.replace
Router.prototype.replace = function replace(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalReplace.call(this, location, onResolve, onReject)
  }

  return originalReplace.call(this, location).catch(error => {
    if (isDuplicateNavigationError(error)) {
      return this.currentRoute
    }
    throw error
  })
}

function checkUser() {
  return new Promise(resolve => {
    if (store.state.userRole === '') {
      const unwatch = store.watch(
        () => store.state.userRole,
        value => {
          unwatch()
          resolve(value)
        }
      )
    } else {
      resolve(store.state.userRole)
    }
  })
}
export default new Router({
  base: process.env.DEPLOY_PAGES ? '/epic-vue/' : '/',
  mode: 'history',
  linkActiveClass: 'is-active',
  linkExactActiveClass: 'is-active',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '/login',
      component: NoNavDash,
      meta: { title: 'EPIC Ready - Login' },
      children: [
        {
          path: '/',
          name: 'login',
          meta: { skipAuth: true },
          component: Login,
          props: true
        }
      ]
    },
    {
      path: '/register',
      component: NoNavDash,
      children: [
        {
          path: '/register',
          name: 'register',
          meta: { skipAuth: true },
          component: Register
        },
        {
          path: '/register/:email/:inviteToken',
          name: 'register-invite',
          component: RegisterInvite,
          meta: { skipAuth: true },
          props: true
        }
      ]
    },
    {
      path: '/confirm-email',
      component: NoNavDash,
      children: [
        {
          path: '/confirm-email/:email/:emailConfirmToken',
          name: 'confirm-email',
          component: ConfirmEmail,
          meta: { skipAuth: true },
          props: true
        }
      ]
    },
    {
      path: '/error',
      component: NoNavDash,
      children: [
        {
          path: '/error',
          name: 'error-404',
          meta: { skipAuth: true },
          component: Error404
        }
      ]
    },
    {
      path: '/reset',
      component: NoNavDash,
      children: [
        {
          path: '/reset',
          name: 'forgot',
          meta: { skipAuth: true },
          component: Forgot
        },
        {
          path: '/reset/:email/:resetToken',
          name: 'reset',
          meta: { skipAuth: true },
          component: Reset,
          props: true
        }
      ]
    },
    {
      path: '/',
      component: MainDashboard,
      meta: { title: 'EPIC Ready', requiresAuth: true },
      children: [
        {
          path: '/',
          name: 'main-home',
          component: Home
        }
      ]
    },
    //Media
    {
      path: '/media',
      component: MediaDashboard,
      meta: { title: 'EPIC Media', requiresAuth: true },
      beforeEnter: async function(to, from, next) {
        await checkUser()
        if (
          (store.state.userRole === 'Super' ||
            store.state.userRole === 'Admin' ||
            store.state.userRole === 'Editor') &&
          !store.state.showNoWorkspace
        ) {
          next(true)
        } else {
          // User has no access to the app or has no workspaces assigned, redirect to dashboard
          next({ path: '/' })
        }
      },
      children: [
        {
          path: '/',
          name: 'media-home',
          meta: { title: 'EPIC Media - Home' },
          component: MediaHome
        },
        {
          path: 'personas',
          meta: { title: 'EPIC Media - Personas' },
          component: PersonasHome,
          children: [
            {
              path: '/',
              name: 'personas',
              component: () => import('./media/views/personas/Personas.vue'),
              meta: {
                title: 'EPIC Media - Personas',
                breadcrumb: [
                  {
                    name: 'Personas',
                    link: '/media/personas',
                    icon: 'fas fa-theater-masks'
                  }
                ]
              }
            },
            {
              path: 'view/:id',
              name: 'viewpersona',
              meta: {
                title: 'EPIC Media - Personas',
                breadcrumb: [
                  {
                    name: 'Personas',
                    link: '/media/personas',
                    icon: 'fas fa-theater-masks'
                  }
                ]
              },
              component: () =>
                import('./media/views/personas/Personas-view.vue'),
              props: true
            },
            {
              path: 'edit/:id',
              name: 'editpersona',
              meta: {
                title: 'EPIC Media - Personas',
                breadcrumb: [
                  {
                    name: 'Personas',
                    link: '/media/personas',
                    icon: 'fas fa-theater-masks'
                  }
                ]
              },
              component: () =>
                import('./media/views/personas/Personas-edit.vue'),
              props: true
            }
          ]
        },
        {
          path: 'networks',
          meta: {
            title: 'EPIC Media - Networks'
          },
          component: NetworksHome,
          children: [
            {
              path: '/',
              name: 'networks',
              component: () => import('./media/views/networks/Networks.vue'),
              meta: {
                title: 'EPIC Media - Networks',
                breadcrumb: [
                  {
                    name: 'Networks',
                    link: '/media/networks',
                    icon: 'fas fa-sitemap'
                  }
                ]
              }
            },
            {
              path: 'view/:id/',
              name: 'viewnetwork',
              meta: {
                title: 'EPIC Media - Networks',
                breadcrumb: [
                  {
                    name: 'Networks',
                    link: '/media/networks',
                    icon: 'fas fa-sitemap'
                  }
                ]
              },
              component: () =>
                import('./media/views/networks/Networks-view.vue'),
              props: true
            },
            {
              path: 'edit/:id/',
              name: 'editnetwork',
              meta: {
                title: 'EPIC Media - Networks',
                breadcrumb: [
                  {
                    name: 'Networks',
                    link: '/media/networks',
                    icon: 'fas fa-sitemap'
                  }
                ]
              },
              component: () =>
                import('./media/views/networks/Networks-edit.vue'),
              props: true
            }
          ]
        },
        {
          path: 'profiles',
          meta: { title: 'EPIC Media - Profiles' },
          component: MediaProfilesHome,
          children: [
            {
              path: '/',
              name: 'profiles',
              meta: {
                title: 'EPIC Media - Profiles',
                breadcrumb: [
                  {
                    name: 'Profiles',
                    link: '/media/profiles',
                    icon: 'fas fa-users'
                  }
                ]
              },
              component: () => import('./media/views/profiles/Profiles.vue'),
              props: true
            },
            // Props path must be last so siblings are viewable
            {
              path: ':service/:profile',
              component: () => import('./media/views/profiles/Posts.vue'),
              props: true,
              children: [
                {
                  path: '/',
                  name: 'viewprofile',
                  redirect: { path: 'all' }
                },
                {
                  path: ':requestedFilter',
                  name: 'profilefilter',
                  component: () => import('./media/views/profiles/Posts.vue'),
                  meta: {
                    title: 'EPIC Media - Profiles',
                    breadcrumb: [
                      {
                        name: 'Profiles',
                        link: '/media/profiles',
                        icon: 'fas fa-users'
                      }
                    ]
                  },
                  props: true
                }
              ]
            },
            {
              path: 'edit/:service/:profile/:id',
              name: 'editprofile',
              meta: {
                title: 'EPIC Media - Profiles',
                breadcrumb: [
                  {
                    name: 'Profiles',
                    link: '/media/profiles',
                    icon: 'fas fa-users'
                  }
                ]
              },
              component: () =>
                import('./media/views/profiles/profiles-edit.vue'),
              props: true
            }
          ]
        },
        {
          path: 'posts',
          meta: { title: 'EPIC Media - Posts' },
          component: MediaPostsHome,
          children: [
            {
              path: '/',
              name: 'posts',
              redirect: { path: 'all' }
            },
            {
              path: 'calendar',
              name: 'post-calendar',
              meta: {
                title: 'EPIC Media - Calendar',
                breadcrumb: [
                  {
                    name: 'Posts',
                    link: '/media/posts',
                    icon: 'fas fa-comment-dots'
                  },
                  {
                    name: 'Calendar',
                    link: '',
                    icon: ''
                  }
                ]
              },
              component: () => import('./media/views/posts/calendar.vue')
            },
            {
              path: 'analytics',
              name: 'analytics',
              meta: {
                title: 'EPIC Media - Analytics',
                breadcrumb: [
                  {
                    name: 'Posts',
                    link: '/media/posts',
                    icon: 'fas fa-comment-dots'
                  },
                  {
                    name: 'Analytics',
                    link: '',
                    icon: ''
                  }
                ]
              },
              component: () =>
                lazyLoadView(import('./media/views/Analytics.vue'))
            },
            {
              path: 'noise',
              name: 'noise',
              meta: {
                title: 'EPIC Media - Noise',
                breadcrumb: [
                  {
                    name: 'Posts',
                    link: '/media/posts',
                    icon: 'fas fa-comment-dots'
                  },
                  {
                    name: 'Noise',
                    link: '',
                    icon: ''
                  }
                ]
              },
              component: () => import('./media/views/Noise.vue')
            },
            {
              path: 'edit/:service/:profile/:id',
              name: 'editpost',
              meta: {
                title: 'EPIC Media - Posts',
                breadcrumb: [
                  {
                    name: 'Posts',
                    link: '/media/posts',
                    icon: 'fas fa-comment-dots'
                  }
                ]
              },
              component: () => import('./media/views/posts/post-edit.vue'),
              props: true
            },
            {
              path: ':requestedFilter',
              name: 'posts-filter',
              component: () => import('./media/views/posts/Posts.vue'),
              meta: {
                title: 'EPIC Media - Posts',
                breadcrumb: [
                  {
                    name: 'Posts',
                    link: '/media/posts',
                    icon: 'fas fa-comment-dots'
                  }
                ]
              },
              props: true
            }
          ]
        },
        {
          path: 'sites',
          name: 'sites',
          meta: {
            title: 'EPIC Media - Sites',
            breadcrumb: [
              {
                name: 'Sites',
                link: '/media/sites',
                icon: 'fas fa-bookmark'
              }
            ]
          },
          component: () => import('./media/views/Sites.vue')
        },
        {
          path: 'noiseoption',
          name: 'noise-option',
          meta: { title: 'EPIC Media - Noise' },
          component: () => import('./media/views/OptionsNoise.vue')
        }
      ]
    },
    //Plan
    {
      path: '/plan',
      component: PlanDashboard,
      meta: { title: 'EPIC Plan', requiresAuth: true },
      beforeEnter: async function(to, from, next) {
        await checkUser()
        if (
          (store.state.userRole === 'Super' ||
            store.state.userRole === 'Admin' ||
            store.state.userRole === 'Editor') &&
          !store.state.showNoWorkspace
        ) {
          next(true)
        } else {
          // User has no access to the app, redirect to dashboard
          next({ path: '/' })
        }
      },
      children: [
        {
          path: '/',
          name: 'plan-home',
          meta: { title: 'EPIC Plan - Home' },
          component: PlanHome
        },
        {
          path: 'prepare',
          meta: { title: 'EPIC Plan - Prepare' },
          component: PlanPrepareHome,
          children: [
            {
              path: '/',
              name: 'prepare-home',
              meta: { title: 'EPIC Plan - Injects' },
              redirect: { path: 'injects-list' }
            },
            {
              path: 'dashboard',
              name: 'prepare-dash',
              meta: {
                title: 'EPIC Plan - Prepare Dashboard'
              },
              component: PlanPrepareDashboard
            },
            {
              path: 'events-calendar',
              name: 'events-calendar',
              meta: {
                title: 'EPIC Plan - Events Calendar',
                breadcrumb: [
                  {
                    name: 'Events',
                    link: '',
                    icon: ''
                  }
                ]
              },
              component: PlanEventsCalendar
            },
            {
              path: 'events',
              name: 'events-cards',
              meta: {
                title: 'EPIC Plan - Events',
                breadcrumb: [
                  {
                    name: 'Events',
                    link: '',
                    icon: ''
                  }
                ]
              },
              component: PlanEvents
            },
            {
              path: 'injects-board',
              name: 'injects-board',
              meta: {
                title: 'EPIC Plan - MSEL Board',
                breadcrumb: [
                  {
                    name: 'MSEL Board',
                    link: '',
                    icon: ''
                  }
                ]
              },
              component: PlanInjectsBoard
            },
            {
              path: 'injects-list',
              name: 'injects-list',
              meta: {
                title: 'EPIC Plan - MSEL List',
                breadcrumb: [
                  {
                    name: 'MSEL List',
                    link: '',
                    icon: ''
                  }
                ]
              },
              component: PlanInjectsList
            },
            {
              path: 'exercise',
              name: 'exercise-stepper',
              meta: {
                title: 'EPIC Plan - Exercise',
                breadcrumb: [
                  {
                    name: 'Exercise',
                    link: '/plan/prepare/exercise?step=0',
                    icon: ''
                  }
                ]
              },
              component: PlanExercise
            },
            {
              path: 'exercise-details',
              name: 'exercise-details',
              meta: {
                title: 'EPIC Plan - Exercise Details',
                breadcrumb: [
                  {
                    name: 'Exercise Details',
                    link: '/plan/prepare/exercise-details',
                    icon: ''
                  }
                ]
              },
              component: PlanExerciseDetails
            },
            {
              path: 'objectives-list',
              name: 'objectives-list',
              meta: {
                title: 'EPIC Plan - Objectives List',
                breadcrumb: [
                  {
                    name: 'Training Objectives',
                    link: '/plan/prepare/objectives-list',
                    icon: ''
                  }
                ]
              },
              component: PlanObjectivesList
            },
            {
              path: 'injects-calendar',
              name: 'injects-calendar',
              meta: {
                title: 'EPIC Plan - Injects Calendar',
                breadcrumb: [
                  {
                    name: 'MSEL Calendar',
                    link: '',
                    icon: ''
                  }
                ]
              },
              component: PlanInjectsCalendar
            }
          ]
        },
        {
          path: 'prepare/inject',
          meta: { title: 'EPIC Plan - Inject' },
          component: PlanPrepareEdit,
          children: [
            {
              path: 'new',
              name: 'planInjectNew',
              meta: {
                title: 'EPIC Plan - Inject New',
                breadcrumb: [
                  {
                    name: 'Inject',
                    link: '/plan/prepare/injects-list',
                    icon: ''
                  }
                ]
              },
              component: PlanManageInject
            },
            {
              path: 'view/:id',
              name: 'view-inject',
              meta: {
                title: 'EPIC Plan - View Inject',
                breadcrumb: [
                  {
                    name: 'Injects',
                    link: '/plan/prepare/injects-list',
                    icon: ''
                  }
                ]
              },
              component: PlanInjectView,
              props: true
            },
            {
              path: ':number/',
              name: 'planInjectView',
              meta: {
                title: 'EPIC Plan - Inject Edit',
                breadcrumb: [
                  {
                    name: 'Inject',
                    link: '/plan/prepare/injects-list',
                    icon: ''
                  }
                ]
              },
              component: PlanManageInject,
              props: true
            }
          ]
        },
        {
          path: 'prepare/event',
          meta: { title: 'EPIC Plan - Events' },
          component: PlanPrepareEdit,
          children: [
            {
              path: 'new',
              name: 'createEvent',
              meta: {
                title: 'EPIC Plan - Events',
                breadcrumb: [
                  {
                    name: 'Events',
                    link: '/plan/prepare/events',
                    icon: ''
                  }
                ]
              },
              component: PlanCreateEvent
            },
            {
              path: 'view/:id',
              name: 'view-event',
              meta: {
                title: 'EPIC Plan - View Event',
                breadcrumb: [
                  {
                    name: 'Events',
                    link: '/plan/prepare/events',
                    icon: ''
                  }
                ]
              },
              component: PlanEventView,
              props: true
            },
            {
              path: 'edit/:id',
              name: 'editEvent',
              meta: {
                title: 'EPIC Plan - Events',
                breadcrumb: [
                  {
                    name: 'Events',
                    link: '/plan/prepare/events',
                    icon: ''
                  }
                ]
              },
              component: PlanCreateEvent,
              props: true
            }
          ]
        },
        {
          path: 'prepare/participants',
          meta: { title: 'EPIC Plan - Participants' },
          component: PlanParticipantHome,
          children: [
            {
              path: '/',
              name: 'participants',
              meta: {
                title: 'EPIC Plan - Participants',
                breadcrumb: [
                  {
                    name: 'Participants',
                    link: '/plan/prepare/participants/',
                    icon: ''
                  }
                ]
              },
              component: PlanParticipants
            },
            {
              path: ':id',
              name: 'view-participant',
              meta: {
                title: 'EPIC Plan - View Participant',
                breadcrumb: [
                  {
                    name: 'Participants',
                    link: '/plan/prepare/participants/',
                    icon: ''
                  }
                ]
              },
              component: PlanParticipantView,
              props: true
            }
          ]
        },
        {
          path: 'prepare/participant',
          meta: { title: 'EPIC Plan - Participant' },
          component: PlanPrepareEdit,
          children: [
            {
              path: 'new',
              name: 'planParticipantNew',
              meta: {
                title: 'EPIC Plan - Participant New',
                breadcrumb: [
                  {
                    name: 'Participants',
                    link: '/plan/prepare/participants/',
                    icon: ''
                  }
                ]
              },
              component: PlanManageParticipant
            },
            {
              path: ':id/',
              name: 'planParticipantEdit',
              meta: {
                title: 'EPIC Plan - Participant Edit',
                breadcrumb: [
                  {
                    name: 'Participants',
                    link: '/plan/prepare/participants/',
                    icon: ''
                  }
                ]
              },
              component: PlanManageParticipant,
              props: true
            },
            {
              path: ':id/trainingobjective/new',
              name: 'planTrainingObjectiveNew',
              meta: {
                title: 'EPIC Plan - Training Objective new',
                breadcrumb: [
                  {
                    name: 'Training Objectives',
                    link: '/plan/prepare/objectives-list',
                    icon: ''
                  }
                ]
              },
              component: PlanManageTrainingObjective,
              props: true
            },
            {
              path: ':id/trainingobjective/:trainingObjID',
              name: 'planTrainingObjectiveView',
              meta: {
                title: 'EPIC Plan - Training Objective Edit',
                breadcrumb: [
                  {
                    name: 'Training Objectives',
                    link: '/plan/prepare/objectives-list',
                    icon: ''
                  }
                ]
              },
              component: PlanManageTrainingObjective,
              props: true
            }
          ]
        },
        {
          path: 'train',
          meta: { title: 'EPIC Plan - Train' },
          component: PlanTrainHome,
          children: [
            {
              path: '/',
              name: 'train-home',
              meta: { title: 'EPIC Plan - Train' },
              redirect: { path: 'msel-tracker' }
            },
            {
              path: 'dashboard',
              name: 'train-dash',
              meta: {
                title: 'EPIC Plan - Train Dashboard'
              },
              component: PlanTrainDashboard
            },
            {
              path: 'msel-timeline',
              name: 'msel-timeline',
              meta: {
                title: 'EPIC Plan - MSEL Timeline',
                breadcrumb: [
                  {
                    name: 'MSEL Timeline',
                    link: '/plan/train/msel-timeline',
                    icon: ''
                  }
                ]
              },
              component: () =>
                lazyLoadView(import('./plan/views/train/MSELTimeline.vue'))
            },
            {
              path: 'msel-tracker',
              name: 'msel-tracker',
              meta: {
                title: 'EPIC Plan - MSEL Tracker',
                breadcrumb: [
                  {
                    name: 'MSEL Tracker',
                    link: '/plan/train/msel-tracker',
                    icon: ''
                  }
                ]
              },
              component: PlanInjectsBoard
            }
          ]
        },
        {
          path: 'assessment',
          meta: { title: 'EPIC Plan - Assess ' },
          component: PlanAssessHome,
          children: [
            {
              path: '/',
              name: 'assessment-home',
              meta: { title: 'EPIC Plan - Assessment' },
              redirect: { path: 'overview' }
            },
            {
              path: 'overview',
              name: 'overview',
              meta: {
                title: 'EPIC Plan - Overview',
                breadcrumb: [
                  {
                    name: 'Overview',
                    link: '/plan/assessment/overview',
                    icon: ''
                  }
                ]
              },
              component: PlanOverview
            },
            {
              path: 'assess-list',
              name: 'assess-list',
              meta: {
                title: 'EPIC Plan - Assessment List',
                breadcrumb: [
                  {
                    name: 'Assess List',
                    link: '/plan/assessment/assess-list',
                    icon: ''
                  }
                ]
              },
              component: PlanAssesList
            },
            {
              name: 'editassess',
              path: 'edit/:id',
              meta: {
                title: 'Epic Plan - Assessment Edit'
              },
              component: PlanAssessmentEdit,
              props: true
            }
          ]
        },
        {
          path: 'feedback',
          meta: { title: 'EPIC Plan - Feedback ' },
          component: PlanFeedbackHome,
          children: [
            {
              path: '/',
              name: 'feedback-home',
              meta: { title: 'EPIC Plan - Feedback' },
              redirect: { path: 'feedbacks' }
            },
            {
              path: 'feedbacks',
              name: 'feedbacks',
              meta: {
                title: 'EPIC Plan - Feedback',
                breadcrumb: [
                  {
                    name: 'Feedback',
                    link: '/plan/feedback/feedbacks',
                    icon: ''
                  }
                ]
              },
              component: PlanFeedback
            },

            {
              path: 'collect',
              name: 'collect',
              meta: {
                title: 'EPIC Plan - Collect',
                breadcrumb: [
                  {
                    name: 'Collect',
                    link: '/plan/feedback/collect',
                    icon: ''
                  }
                ]
              },
              component: PlanCollect
            },
            {
              name: 'viewfeedback',
              path: 'view/:id',
              meta: {
                title: 'Epic Plan - View Feedback'
              },
              component: PlanFeedbackView,
              props: true
            }
          ]
        },
        {
          path: 'reports',
          name: 'reports-home',
          meta: { title: 'EPIC Plan - Reports' },
          component: PlanReportsHome,
          children: [
            {
              path: 'custom',
              name: 'reportsList',
              meta: {
                title: 'EPIC Plan - Reports List',
                breadcrumb: [
                  {
                    name: 'Custom Reports',
                    link: '/plan/reports/custom',
                    icon: ''
                  }
                ]
              },
              component: PlanReportsList
            },
            {
              path: 'analytics',
              name: 'planAnalytics',
              meta: {
                title: 'EPIC Plan - Analytics',
                breadcrumb: [
                  {
                    name: 'Analytics',
                    link: '/plan/reports/analytics',
                    icon: ''
                  }
                ]
              },
              component: PlanReports,
              props: true
            },
            {
              path: 'export',
              name: 'planAnalyticsExport',
              meta: {
                title: 'EPIC Plan - Analytics Export',
                breadcrumb: [
                  {
                    name: 'Analytics',
                    link: '/plan/reports/export',
                    icon: ''
                  }
                ]
              },
              beforeEnter: async function(to, from, next) {
                await checkUser()
                if (
                  store.state.userRole === 'Super' &&
                  !store.state.showNoWorkspace
                ) {
                  next(true)
                } else {
                  // User has no access to the app, redirect to dashboard
                  next({ path: '/plan/reports/analytics' })
                }
              },
              component: PlanReportsExport
            },
            {
              path: 'custom/:id',
              name: 'viewReport',
              meta: {
                title: 'EPIC Plan - Custom Reports',
                breadcrumb: [
                  {
                    name: 'Custom Reports',
                    link: '',
                    icon: ''
                  }
                ]
              },
              component: PlanReports,
              props: true
            }
          ]
        }
      ]
    },
    //Web
    {
      path: '/web',
      component: WebDashboard,
      meta: { title: 'EPIC Web' },
      props: route => ({
        query: route.query.q,
        tab: route.query.t
      }),
      children: [
        {
          path: '/',
          name: 'web-home',
          meta: { skipAuth: true },
          component: WebHome
        },
        {
          path: ':workspace',
          name: 'allPosts',
          meta: { skipAuth: true },
          component: WebHome,
          props: true
        },
        {
          path: ':workspace/profiles',
          props: true,
          meta: { skipAuth: true },
          component: WebProfilesHome
        },
        {
          path: ':workspace/news',
          props: true,
          meta: { skipAuth: true },
          component: WebNewsHome
        },
        {
          path: ':workspace/:service',
          name: 'allPostsOnService',
          meta: { skipAuth: true },
          component: PostsOnService,
          props: true
        },
        {
          name: 'editfeedbackpublic',
          path: ':workspace/feedback/edit/:id',
          meta: {
            title: 'Epic Plan - Feedback',
            skipAuth: true
          },
          component: PublicPlanFeedbackEdit,
          props: true
        }
      ]
    },
    {
      path: '/web/:workspace/:service/:username',
      component: SocialMediaDashboard,
      children: [
        {
          path: '/',
          name: 'getUser',
          meta: { skipAuth: true },
          component: WebRouter,
          props: true
        },
        {
          path: ':postID',
          name: 'getPost',
          meta: { skipAuth: true },
          component: WebRouter,
          props: true
        }
      ]
    },
    //Dev
    {
      path: '/dev',
      component: DevDashboard,
      meta: { title: 'EPIC Developer', requiresAuth: true },
      beforeEnter: async function(to, from, next) {
        await checkUser()
        if (store.state.userRole === 'Super') {
          next(true)
        } else {
          // User has no access to the app, redirect to dashboard
          next({ path: '/' })
        }
      },
      children: [
        {
          path: '/',
          name: 'dev-home',
          component: DevHome
        },
        {
          path: '/dev/users',
          name: 'dev-users',
          component: DevUsers,
          meta: {
            title: 'Epic Developer - Users',
            breadcrumb: [
              {
                name: 'Users',
                link: '',
                icon: ''
              }
            ]
          }
        },
        {
          path: '/dev/workspace',
          name: 'dev-workspace',
          component: DevWorkspaces,
          meta: {
            title: 'Epic Developer - Workspace',
            breadcrumb: [
              {
                name: 'Workspace',
                link: '',
                icon: ''
              }
            ]
          }
        }
      ]
    },
    //Settings
    {
      path: '/settings',
      name: 'settings-home',
      component: SettingsDashboard,
      meta: {
        title: 'EPIC Settings - Home',
        breadcrumb: [
          {
            name: 'Home',
            link: '',
            icon: ''
          }
        ],
        requiresAuth: true
      },
      redirect: { path: 'settings/general/user' },
      children: [
        {
          path: 'plan',
          name: 'plansettingshome',
          meta: {
            title: 'EPIC Settings',
            breadcrumb: [
              {
                name: 'Plan Settings',
                link: '',
                icon: ''
              }
            ]
          },
          component: SettingsPlanHome,
          beforeEnter: async function(to, from, next) {
            await checkUser()
            if (
              (store.state.userRole === 'Super' ||
                store.state.userRole === 'Admin' ||
                store.state.userRole === 'Editor') &&
              !store.state.showNoWorkspace
            ) {
              next(true)
            } else {
              // User has no access to the app, redirect to dashboard
              next({ path: '/' })
            }
          },
          children: [
            {
              name: 'status',
              path: 'status',
              component: Status,
              meta: {
                title: 'EPIC Settings - Status',
                breadcrumb: [
                  {
                    name: 'Status',
                    link: '',
                    icon: ''
                  }
                ]
              }
            },
            {
              path: 'jmets',
              name: 'planJmets',
              component: PlanJMETs,
              meta: {
                title: 'EPIC Settings - JMETs',
                breadcrumb: [
                  {
                    name: 'JMETs',
                    link: '',
                    icon: ''
                  }
                ]
              }
            },
            {
              path: 'organizations',
              name: 'planOrganizations',
              meta: {
                title: 'EPIC Settings - Organization',
                breadcrumb: [
                  {
                    name: 'Organizations',
                    link: '',
                    icon: ''
                  }
                ]
              },
              component: PlanOrganizations
            },
            {
              path: 'platforms',
              name: 'planPlatforms',
              meta: {
                title: 'EPIC Settings - Platforms',
                breadcrumb: [
                  {
                    name: 'Platforms',
                    link: '',
                    icon: ''
                  }
                ]
              },
              component: PlanPlatforms
            },
            {
              path: 'participantType',
              name: 'planParticipantTypes',
              meta: {
                title: 'EPIC Settings - Participant Types',
                breadcrumb: [
                  {
                    name: 'Participant Types',
                    link: '',
                    icon: ''
                  }
                ]
              },
              component: PlanParticipantTypes
            },
            {
              path: 'joint-staff-training-priorities',
              name: 'planJointStaffTrainingPriorities',
              meta: {
                title: 'EPIC Settings - Joint Staff Training Priorities',
                breadcrumb: [
                  {
                    name: 'Joint Staff Training Priorities',
                    link: '',
                    icon: ''
                  }
                ]
              },
              component: PlanJointStaffTrainingPriorities
            },
            {
              path: 'reasons',
              name: 'planReasons',
              meta: {
                title: 'EPIC Settings',
                breadcrumb: [
                  {
                    name: 'Reasons',
                    link: '',
                    icon: ''
                  }
                ]
              },
              component: PlanReasons
            },
            {
              path: 'priority-levels',
              name: 'planPriorityLevels',
              meta: {
                title: 'EPIC Settings',
                breadcrumb: [
                  {
                    name: 'Priority Levels',
                    link: '',
                    icon: ''
                  }
                ]
              },
              component: PlanPriorityLevels
            },
            {
              path: 'boards',
              name: 'planBoards',
              meta: {
                title: 'EPIC Settings',
                breadcrumb: [
                  {
                    name: 'Boards',
                    link: '',
                    icon: ''
                  }
                ]
              },
              component: Boards
            },
            {
              path: 'methods',
              name: 'planMethods',
              meta: {
                title: 'EPIC Settings',
                breadcrumb: [
                  {
                    name: 'Methods',
                    link: '',
                    icon: ''
                  }
                ]
              },
              component: Methods
            },
            {
              path: 'servicedepartmenttype',
              name: 'planServiceDepartmentType',
              meta: {
                title: 'EPIC Settings',
                breadcrumb: [
                  {
                    name: 'Service/Department Type',
                    link: '',
                    icon: ''
                  }
                ]
              },
              component: ServiceDepartmentType
            },
            {
              path: 'commandAgency',
              name: 'planCommandAgency',
              meta: {
                title: 'EPIC Settings',
                breadcrumb: [
                  {
                    name: 'Command/Agency',
                    link: '',
                    icon: ''
                  }
                ]
              },
              component: CommandAgencies
            },
            {
              path: 'servicedepartment',
              name: 'planServiceDepartment',
              meta: {
                title: 'EPIC Settings',
                breadcrumb: [
                  {
                    name: 'Service/Department',
                    link: '',
                    icon: ''
                  }
                ]
              },
              component: ServiceDepartment
            },
            {
              path: 'injectowners',
              name: 'planInjectOwners',
              meta: {
                title: 'EPIC Settings',
                breadcrumb: [
                  {
                    name: 'Inject Owners',
                    link: '',
                    icon: ''
                  }
                ]
              },
              component: InjectOwners
            }
          ]
        },
        {
          path: 'media',
          name: 'mediasettingshome',
          meta: {
            title: 'EPIC Settings',
            breadcrumb: [
              {
                name: 'Media Settings',
                link: '',
                icon: ''
              }
            ]
          },
          component: SettingsMediaHome
        },
        {
          path: 'workspace',
          name: 'workspacesettingshome',
          meta: {
            title: 'EPIC Settings',
            breadcrumb: [
              {
                name: 'Workspace Settings',
                link: '',
                icon: ''
              }
            ]
          },
          component: SettingsWorkspaceHome,
          children: [
            {
              path: 'members',
              name: 'members',
              component: WorkspaceMembers,
              meta: {
                title: 'EPIC Settings',
                breadcrumb: [
                  {
                    name: 'Members',
                    link: '',
                    icon: ''
                  }
                ]
              }
            },
            {
              path: 'timezone',
              name: 'timezone',
              component: WorkspaceTimezone,
              meta: {
                title: 'EPIC Settings',
                breadcrumb: [
                  {
                    name: 'Timezone',
                    link: '',
                    icon: ''
                  }
                ]
              }
            },
            {
              path: 'apps',
              name: 'apps',
              component: WorkspaceApps,
              meta: {
                title: 'EPIC Apps',
                breadcrumb: [
                  {
                    name: 'Apps',
                    link: '',
                    icon: ''
                  }
                ]
              }
            }
          ]
        },
        {
          path: 'general',
          name: 'generalsettingshome',
          component: SettingsGeneralHome,
          meta: {
            title: 'EPIC Settings',
            breadcrumb: [
              {
                name: 'General Settings',
                link: '',
                icon: ''
              }
            ]
          },
          children: [
            {
              path: 'user',
              name: 'userSettings',
              component: UserSettings,
              meta: {
                title: 'EPIC Settings',
                breadcrumb: [
                  {
                    name: 'User Settings',
                    link: '',
                    icon: ''
                  }
                ]
              }
            }
          ]
        }
      ]
    },
    //Note
    {
      path: '/note',
      component: NoteDashboard,
      meta: { title: 'EPIC Notebook', requiresAuth: true },
      beforeEnter: async function(to, from, next) {
        await checkUser()
        if (
          (store.state.userRole === 'Super' ||
            store.state.userRole === 'Admin' ||
            store.state.userRole === 'Editor') &&
          !store.state.showNoWorkspace
        ) {
          next(true)
        } else {
          // User has no access to the app, redirect to dashboard
          next({ path: '/' })
        }
      },
      children: [
        {
          path: '/',
          name: 'notebook-home',
          meta: { title: 'EPIC Notebook' },
          component: NoteHome
        },

        {
          path: ':notebookID',
          name: 'notebook-view',
          meta: {
            title: 'EPIC Notebook - View',
            breadcrumb: [
              {
                name: 'Notebook',
                link: '/note',
                icon: ''
              }
            ]
          },
          component: NoteBookView,
          props: true
        },
        {
          path: 'edit/:notebookID',
          name: 'notebook-editor',
          meta: {
            title: 'EPIC Notebook - Edit',
            breadcrumb: [
              {
                name: 'Notebook',
                link: '/note',
                icon: ''
              }
            ]
          },
          component: NoteBookEdit,
          props: true
        },
        {
          path: ':notebookID/:pageID',
          name: 'notebook-page',
          meta: {
            title: 'EPIC Notebook - Page',
            breadcrumb: [
              {
                name: 'Notebook',
                link: '/note',
                icon: ''
              }
            ]
          },
          component: NoteBookView,
          props: true
        },
        {
          path: 'folder/edit/:noteFolderID',
          name: 'noteFolder-edit',
          meta: {
            title: 'EPIC Note Folder - Edit',
            breadcrumb: [
              {
                name: 'Notebook',
                link: '/note',
                icon: ''
              }
            ]
          },
          component: NoteFolderEdit,
          props: true
        }
      ]
    },
    //Map
    {
      path: '/map',
      component: MapDashboard,
      meta: { title: 'EPIC Map', requiresAuth: true },
      beforeEnter: async function(to, from, next) {
        await checkUser()
        if (
          (store.state.userRole === 'Super' ||
            store.state.userRole === 'Admin' ||
            store.state.userRole === 'Editor') &&
          !store.state.showNoWorkspace
        ) {
          next(true)
        } else {
          // User has no access to the app, redirect to dashboard
          next({ path: '/' })
        }
      },
      children: [
        {
          path: '/',
          name: 'map-home',
          component: MapHome
        },
        {
          path: 'globe',
          name: 'map-globe',
          component: () => lazyLoadView(import('./map/views/CesiumMap.vue'))
        },
        {
          path: 'monitor',
          name: 'map-monitor',
          redirect: { path: 'monitor/all' }
        },
        {
          path: 'monitor/:requestedFilter',
          name: 'monitor-filter',
          component: MonitorMap,
          props: true
        },
        {
          path: 'copmap/edit/:id',
          name: 'copmapedit',
          component: () => import('./map/views/COPMapEdit.vue'),
          props: true
        }
      ]
    },
    //Chat
    {
      path: '/chat',
      component: ChatDashboard,
      meta: { title: 'EPIC Chat', requiresAuth: true },
      beforeEnter: async function(to, from, next) {
        await checkUser()
        if (
          (store.state.userRole === 'Super' ||
            store.state.userRole === 'Admin' ||
            store.state.userRole === 'Editor') &&
          !store.state.showNoWorkspace
        ) {
          next(true)
        } else {
          // User has no access to the app, redirect to dashboard
          next({ path: '/' })
        }
      },
      children: [
        {
          path: '/',
          name: 'chat-home',
          component: ChatHome
        }
      ]
    },
    //Email
    {
      path: '/email',
      component: EmailDashboard,
      meta: { title: 'EPIC Email', requiresAuth: true },
      beforeEnter: async function(to, from, next) {
        await checkUser()
        if (store.state.userRole === 'Super') {
          next(true)
        } else {
          // User has no access to the app, redirect to dashboard
          next({ path: '/' })
        }
      },
      children: [
        {
          path: '/',
          name: 'email-home',
          component: EmailHome
        },
        {
          name: 'email-inbox',
          path: ':id',
          component: EmailHome,
          props: true
        }
      ]
    },
    //Observe
    {
      path: '/observe',
      component: ObserveDashboard,
      meta: { title: 'EPIC Observe', requiresAuth: true },
      beforeEnter: async function(to, from, next) {
        await checkUser()
        if (store.state.userRole === 'Super') {
          next(true)
        } else {
          // User has no access to the app, redirect to dashboard
          next({ path: '/' })
        }
      },
      children: [
        {
          path: '/',
          name: 'observe-home',
          component: ObserveHome
        },
        {
          path: 'post',
          name: 'observe-post',
          component: ObservePost
        },
        {
          path: 'profile',
          name: 'observe-profile',
          component: ObserveProfile
        }
      ]
    },
    //Activity
    {
      path: '/activity',
      component: ActivityDashboard,
      meta: { title: 'EPIC Activity', requiresAuth: true },
      beforeEnter: async function(to, from, next) {
        await checkUser()
        if (
          (store.state.userRole === 'Super' ||
            store.state.userRole === 'Admin' ||
            store.state.userRole === 'Editor') &&
          !store.state.showNoWorkspace
        ) {
          next(true)
        } else {
          // User has no access to the app, redirect to dashboard
          next({ path: '/' })
        }
      },
      children: [
        {
          path: '/',
          name: 'activity-home',
          component: ActivityHome
        }
      ]
    },
    //Learn
    {
      path: '/learn',
      component: LearnDashboard,
      meta: { title: 'EPIC Learn', requiresAuth: true },
      beforeEnter: async function(to, from, next) {
        await checkUser()
        if (store.state.userRole === 'Super') {
          next(true)
        } else {
          // User has no access to the app, redirect to dashboard
          next({ path: '/' })
        }
      },
      children: [
        {
          path: '/',
          name: 'learn-home',
          component: LearnHome
        },
        {
          path: 'course/:courseId',
          name: 'learn-course',
          component: LearnHome,
          props: true
        },
        {
          path: 'course/:courseId/:lessonId',
          name: 'learn-course-lesson',
          component: LearnHome,
          props: true
        }
      ]
    },
    //Resources
    {
      path: '/resources',
      component: ResourcesDashboard,
      meta: { title: 'EPIC Resources', requiresAuth: true },
      beforeEnter: async function(to, from, next) {
        await checkUser()
        if (store.state.userRole === 'Super') {
          next(true)
        } else {
          // User has no access to the app, redirect to dashboard
          next({ path: '/' })
        }
      },
      children: [
        {
          path: '/',
          name: 'resources-home',
          component: ResourcesHome
        }
      ]
    },
    //Command
    {
      path: '/command',
      component: CommandDashboard,
      meta: { title: 'EPIC Command', requiresAuth: true },
      beforeEnter: async function(to, from, next) {
        await checkUser()
        if (store.state.userRole === 'Super') {
          next(true)
        } else {
          // User has no access to the app, redirect to dashboard
          next({ path: '/' })
        }
      },
      children: [
        {
          path: '/',
          name: 'command-home',
          component: CommandHome
        }
      ]
    },
    {
      path: '*',
      meta: { title: 'EPIC 404', skipAuth: true },
      component: Error404
    }
  ]
})

// Lazy-loads view components, but with better UX. A loading view
// will be used if the component takes a while to load, falling
// back to a timeout view in case the page fails to load. You can
// use this component to lazy-load a route with:
//
// component: () => lazyLoadView(import('@shared/my-view'))
//
// NOTE: Components loaded with this strategy DO NOT have access
// to in-component guards, such as beforeRouteEnter,
// beforeRouteUpdate, and beforeRouteLeave. You must either use
// route-level guards instead or lazy-load the component directly:
//
// component: () => import('@views/my-view')
//
function lazyLoadView(AsyncView) {
  const AsyncHandler = () => ({
    component: AsyncView,
    // A component to use while the component is loading.
    //loading: require('@shared/loading').default,
    // A fallback component in case the timeout is exceeded
    // when loading the component.
    //error: require('@shared/timeout').default,
    // Delay before showing the loading component.
    // Default: 200 (milliseconds).
    delay: 400,
    // Time before giving up trying to load the component.
    // Default: Infinity (milliseconds).
    timeout: 10000
  })

  return Promise.resolve({
    functional: true,
    render(h, { data, children }) {
      // Transparently pass any props or children
      // to the view component.
      return h(AsyncHandler, data, children)
    }
  })
}
