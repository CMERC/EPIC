<template>
  <section class="hero is-medium">
    <div class="hero-body">
      <div class="container has-text-centered">
        <figure>
          <img src="@/shared/assets/command.svg"
               alt="EPIC Command">
          <figcaption class="epiclogo has-text-dark">
            EPIC Command
          </figcaption>
        </figure>
        <div class="content has-text-left mt-5 has-text-dark">
          <p class="is-size-6">
            The EPIC Ready COMMAND application is currently undergoing design and development. COMMAND allows users to view and manage workspaces across exercises and their iterations. COMMAND enables users to view reports for status and trend analysis across exercises and exercise iterations, as well as coordinate planning and execution. In addition, they will be able to manage multiple personnel across workspaces.
          </p>
          <a class="has-text-link has-text-underline"
             href="https://xd.adobe.com/view/fdeb152c-df26-4a12-8d35-be7f4d422694-a8b8/?fullscreen"
             target="_blank">
            View the Command Mockup
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'command-home'
}
</script>
<style lang="scss" scoped>
.hero {
  figure,
  figure * {
    display: inline-block;
    img {
      height: 64px;
      margin: 0 1.5rem;
    }
    figcaption {
      font-size: 2rem;
    }
  }
  .content {
    margin: 0 auto;
    max-width: calc(65vw);
  }
}

@media screen and (min-width: 1024px - 1px) {
  .hero {
    figure,
    figure * {
      figcaption {
        font-size: 5rem;
      }
    }
    .content {
      margin: 0 auto;
      max-width: calc(55vw);
    }
  }
}
</style>
