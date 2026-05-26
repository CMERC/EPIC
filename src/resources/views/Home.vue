<template>
  <section class="hero is-medium">
    <div class="hero-body">
      <div class="container has-text-centered">
        <figure>
          <img src="@/shared/assets/resources.svg"
               alt="EPIC Resources">
          <figcaption class="epiclogo has-text-dark">
            EPIC Resources
          </figcaption>
        </figure>
        <div class="content has-text-left mt-5 has-text-dark">
          <p class="is-size-6">
            The EPIC Ready RESOURCES application and capability is currently undergoing design and development. RESOURCES will enable users to document requirements and sourcing, and allocate and manage backside support for each exercise iteration.
          </p>
          <a class="has-text-link has-text-underline"
             href="https://xd.adobe.com/view/f814d8ad-ab8c-46da-a946-1e70692c78b4-ad47/?fullscreen"
             target="_blank">
            View the Resources Mockup
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'resource-home'
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
