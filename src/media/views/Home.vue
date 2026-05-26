<template>
  <div class="container is-fullhd">
    <section class="section">
      <nav class="level">
        <div class="level-left">
          <quick-create area="media" />
        </div>
        <div class="level-right">
          <div class="level-item">
            <help-content :reference="'media.general'"
                          toggle
                          dropdown />
          </div>
        </div>
      </nav>
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <div class="tile is-child notification has-shadow"> 
            <LinkSidebar :data="links"
                         :area="'media'" />
          </div>
        </div>
        <div class="tile is-parent is-8">
          <article class="tile">
            <div class="columns is-multiline widgets">
              <div class="column is-half">
                <post-count :type='"Drafted"' />
              </div>
              <div class="column is-half">
                <post-count :type='"Scheduled"' />
              </div>
              <div class="column is-half">
                <post-count :type='"Published"' />
              </div>
              <div class="column is-half">
                <post-count :type='"Posted"' />
              </div>
              <div class="column is-half">
                <post-count />
              </div>
              <div class="column is-half">
                <post-difficulty />
              </div>
              <div class="column is-half">
                <media-profiles-count :type="'Profiles'" />
              </div>
              <div class="column is-half">
                <media-personas-count :type="'Personas'" />
              </div>
              <div class="column is-half">
                <media-networks-count :type="'Networks'" />
              </div>
              <div class="column is-half">
                <media-sites-count />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import LinkSidebar from '@/shared/components/linkSidebar'
import PostCount from '../components/widgets/post-count'
import PostDifficulty from '../components/widgets/post-difficulty'
import MediaProfilesCount from '../components/widgets/mediaprofiles-count'
import MediaPersonasCount from '../components/widgets/mediapersonas-count'
import MediaNetworksCount from '../components/widgets/medianetworks-count'
import MediaSitesCount from '../components/widgets/mediasites-count'
import HelpContent from '@/shared/components/helpcontent'
import QuickCreate from '@/shared/components/quick-create'
export default {
  name: 'MediaHome',
  components: {
    LinkSidebar,
    HelpContent,
    PostCount,
    PostDifficulty,
    MediaProfilesCount,
    MediaPersonasCount,
    MediaNetworksCount,
    MediaSitesCount,
    QuickCreate
  },
  data() {
    return {
      links: [
        {
          name: 'Posts',
          icon: 'fas fa-comment-dots',
          links: [
            {
              name: 'View Posts',
              url: '/media/posts/all'
            },
            { name: 'Calendar', url: '/media/posts/calendar' },
            {
              name: 'Analytics',
              url: '/media/posts/analytics'
            },
            { name: 'Noise', url: '/media/posts/noise' }
          ]
        },
        {
          name: 'Profiles',
          icon: 'fas fa-users',
          links: [{ name: 'Profiles', url: '/media/profiles' }]
        },
        {
          name: 'Personas',
          icon: 'fas fa-theater-masks',
          links: [{ name: 'Personas', url: '/media/personas' }]
        },
        {
          name: 'Networks',
          icon: 'fas fa-sitemap',
          links: [{ name: 'Networks', url: '/media/networks' }]
        },
        {
          name: 'Sites',
          icon: 'fas fa-bookmark',
          links: [{ name: 'Sites', url: '/media/sites' }]
        }
      ]
    }
  }
}
</script>
