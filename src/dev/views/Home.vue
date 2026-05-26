<template>
  <div class="container">
    <loading-state :isFullPage='true'
                   :isLoading='$apollo.loading' />
    <section class="section is-small has-text-centered">
      <div class="columns is-multiline is-mobile">
        <div class="column is-one-third-desktop is-12-mobile is-half-tablet">
          <router-link :to="{name: 'dev-users'}">
            <div class="card">
              <div class="card-content">
                <div class="columns is-mobile">
                  <div class="column">
                    <span class="icon is-large">
                      <i class="fas fa-users fa-3x has-text-networks"></i>
                    </span>
                  </div>
                  <div class="column is-two-thirds-desktop is-two-thirds-mobile is-two-thirds-tablet is-paddingless">
                    <div class="columns is-multiline is-gapless is-mobile">
                      <div class="column is-12-desktop is-12-tablet is-12-mobile">
                        <p class="subtitle has-text-right is-size-6">Users</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </div>
        <div class="column is-one-third-desktop is-12-mobile is-half-tablet">
          <router-link :to="{name: 'dev-workspace'}">
            <div class="card">
              <div class="card-content">
                <div class="columns is-mobile">
                  <div class="column">
                    <span class="icon is-large">
                      <i class="fas fa-bookmark fa-3x has-text-networks"></i>
                    </span>
                  </div>
                  <div class="column is-two-thirds-desktop is-two-thirds-mobile is-two-thirds-tablet is-paddingless">
                    <div class="columns is-multiline is-gapless is-mobile">
                      <div class="column is-12-desktop is-12-tablet is-12-mobile">
                        <p class="subtitle has-text-right is-size-6">Workspaces</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </div>

      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'DeveloperHome'
}
</script>
