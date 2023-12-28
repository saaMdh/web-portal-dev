<template>
  <div class="o-footer">
    <v-footer theme="dark">
      <v-container class="px-0">
        <v-row dense>
          <v-col cols="12" md="4" class="text-center text-md-start">
            <img
              rel="preload"
              as="image"
              width="128"
              height="128"
              alt="ok-logo"
              class="mb-3"
              src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE3LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMiIgYmFzZVByb2ZpbGU9InRpbnkiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIgoJIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMjI1LjAzN3B4IiBoZWlnaHQ9IjE2Mi40NjFweCIgdmlld0JveD0iMCAwIDIyNS4wMzcgMTYyLjQ2MSIgb3ZlcmZsb3c9InZpc2libGUiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNNzAuNTY5LDAuMDczYy0yNS45MTUsMC00Ni45MjMsMjEuMDA4LTQ2LjkyMyw0Ni45MjNjMCwyMi44NjIsMTYuNDUxLDQyLjAzOSwzOS4wNTksNDYuNDU4CgljMy4xNjgsMC42MTksMi4yMTEsMS45NTEsMS45NzEsMy41ODdjLTAuNTQ4LDMuNzQ3LDAuMTQyLDguNzEsNy41MDcsOC4xOThjMjIuNTEzLTEuNTY2LDQ1LjMwOC0zMy4zNTUsNDUuMzA4LTU4LjI0MgoJQzExNy40OTIsMjEuMDgxLDk2LjQ4MywwLjA3Myw3MC41NjksMC4wNzN6IE03MC40OTIsNzAuMDk3Yy0xMi45ODgsMC0yMy41MTYtMTAuNTI5LTIzLjUxNi0yMy41MTYKCWMwLTEyLjk4NywxMC41MjgtMjMuNTE2LDIzLjUxNi0yMy41MTZjMTIuOTg4LDAsMjMuNTE2LDEwLjUyOSwyMy41MTYsMjMuNTE2Qzk0LjAwOCw1OS41NjgsODMuNDgsNzAuMDk3LDcwLjQ5Miw3MC4wOTd6CgkgTTEyMS44ODQsODYuNjkxYy0yLjAwMy0wLjkzMy0zLjM5MS0yLjk2NC0zLjM5MS01LjMxOWMwLTEuMTEyLDAuMzA5LTIuMTUyLDAuODQ3LTMuMDM4bDAuNTcxLTAuODc2CgljNS41MTUtOC44OCw4LjY5OS0xOS4zNTcsOC42OTktMzAuNTc5YzAtMTEuMjEtMy4xNzgtMjEuNjc4LTguNjgyLTMwLjU1MWwtMC40OTktMC43ODNjLTAuNTczLTAuOTA2LTAuOTA0LTEuOTc5LTAuOTA0LTMuMTMKCWMwLTIuMzksMS40MjktNC40NDYsMy40OC01LjM2bDExLjA2OS01LjAxN2MwLjc0MS0wLjMzOCwxLjU2NC0wLjUyNiwyLjQzMS0wLjUyNmMyLjEyNiwwLDMuOTg4LDEuMTMxLDUuMDE2LDIuODI0bDAuNDg0LDAuNzk4CgljMy4wMjYsNS4wOTUsNS41MTUsMTAuNTQ1LDcuMzg4LDE2LjI3NGwwLjIxMiwwLjY2NGMwLjI3NSwwLjg2NCwwLjc1NiwxLjY3NywxLjQ0MSwyLjM2MmMyLjI5MSwyLjI5MSw2LjAwNCwyLjI5MSw4LjI5NSwwCglsMjIuNzYtMjIuNzE3YzIuMjkxLTIuMjkxLDYuMDA0LTIuMjkxLDguMjk1LDBsOC4zMDYsOC4zMDZjMi4yOTEsMi4yOTEsMi4yOTEsNi4wMDQsMCw4LjI5NWwtMjAuMjE0LDIwLjE4OAoJYy00LjU4MSw0LjU4MS00LjU4MiwxMi4wMDksMCwxNi41OTFsMjAuNDQ0LDIwLjQyMmMyLjI5MSwyLjI5MSwyLjI5MSw2LjAwNCwwLDguMjk1bC04LjMwNSw4LjMzN2MtMi4yOTEsMi4yOTEtNi4wMDQsMi4yOTEtOC4yOTUsMAoJbC0yMi45OTEtMjIuODIzYy0yLjI5MS0yLjI5MS02LjAwNC0yLjI5MS04LjI5NSwwYy0wLjcxNiwwLjcxNi0xLjIwOCwxLjU3MS0xLjQ3NiwyLjQ3OGwtMC4yNDksMC43NjIKCWMtMS44OTMsNS43MzItNC40MDIsMTEuMTgzLTcuNDQ4LDE2LjI3NmwtMC40MTYsMC42ODVjLTEuMDM2LDEuNjYyLTIuODc5LDIuNzY3LTQuOTgxLDIuNzY3Yy0wLjkxMSwwLTEuNzc0LTAuMjA4LTIuNTQzLTAuNTc4CglMMTIxLjg4NCw4Ni42OTF6IE0xNi42MzIsMTYyLjQ2MWMtNS40NzcsMC05LjYyLTEuNDI3LTEyLjQyNC00LjI4MkMxLjQwMiwxNTUuMzIzLDAsMTUxLjA1OCwwLDE0NS4zODEKCWMwLTUuNjc3LDEuNDAyLTkuOTQzLDQuMjA4LTEyLjc5OGMyLjgwNS0yLjg1NSw2Ljk0Ny00LjI4MywxMi40MjQtNC4yODNzOS42MTgsMS40MjgsMTIuNDI0LDQuMjgzCgljMi44MDUsMi44NTUsNC4yMDgsNy4xMjEsNC4yMDgsMTIuNzk4YzAsNS42NzctMS40MDMsOS45NDMtNC4yMDgsMTIuNzk4QzI2LjI1MSwxNjEuMDM0LDIyLjExLDE2Mi40NjEsMTYuNjMyLDE2Mi40NjF6CgkgTTE2LjYzMiwxNTYuNjM1YzMuMDU0LDAsNS40MDMtMC44ODgsNy4wNDYtMi42NjRjMS42NDMtMS43NzYsMi40NjUtNC42MzksMi40NjUtOC41OWMwLTMuOTUxLTAuODE0LTYuODE0LTIuNDQtOC41OQoJYy0xLjYyNy0xLjc3NS0zLjk4NC0yLjY2NC03LjA3MS0yLjY2NGMtMy4wNTUsMC01LjQwMywwLjg4OS03LjA0NiwyLjY2NGMtMS42NDQsMS43NzYtMi40NjUsNC42MzktMi40NjUsOC41OQoJYzAsMy45NTEsMC44MTMsNi44MTQsMi40NCw4LjU5QzExLjE4NywxNTUuNzQ3LDEzLjU0NSwxNTYuNjM1LDE2LjYzMiwxNTYuNjM1eiBNNzUuMDI5LDE2MS45MTNjLTQuMDE3LDAtNy4wNDYtMS4wMjEtOS4wODgtMy4wNjMKCWMtMi4wNDEtMi4wNDEtMy4wNjMtNS4wNzEtMy4wNjMtOS4wODhzMS4wMjEtNy4wNDYsMy4wNjMtOS4wODhjMi4wNDEtMi4wNDEsNS4wNy0zLjA2Myw5LjA4OC0zLjA2M2g5LjAxM3Y1LjAzaC04LjE2NwoJYy0yLjA5MSwwLTMuNjAzLDAuMzczLTQuNTMyLDEuMTJjLTAuOTI5LDAuNzQ3LTEuNDc4LDEuODY3LTEuNjQzLDMuMzYyaDE0LjE0MnY0Ljk3OUg2OS43MDFjMC4wNjYsMS40NjEsMC41NjQsMi42MTUsMS40OTQsMy40NjEKCWMwLjkyOSwwLjg0NywyLjQ5LDEuMjcsNC42ODEsMS4yN2g4LjM2NnY1LjA3OUg3NS4wMjl6IE0xMzMuMDI3LDE2MS45MTNsLTkuNDExLTExLjgwMnYxMS44MDJoLTYuNjczdi0zMy4wNjVoNi42NzN2MTguNjc0CglsOC43MTQtOS45MWg3Ljc2OGwtOS45NTksMTAuODU2bDEwLjg1NiwxMy40NDVIMTMzLjAyN3ogTTE3OS43OTIsMTYxLjkxM3YtNS4wM2gxMi41OTljMS41NiwwLDIuMzQxLTAuNzc5LDIuMzQxLTIuMzQKCWMwLTEuNTI3LTAuNzgxLTIuMjkxLTIuMzQxLTIuMjkxaC01LjAyOWMtMi4zNTgsMC00LjE4My0wLjYzMS01LjQ3OC0xLjg5MmMtMS4yOTUtMS4yNjEtMS45NDItMy4wNzEtMS45NDItNS40MjgKCWMwLTIuMzU3LDAuNjM4LTQuMTY2LDEuOTE3LTUuNDI3YzEuMjc4LTEuMjYxLDMuMDk2LTEuODkzLDUuNDUzLTEuODkzaDEyLjg5N3Y1LjA4aC0xMS4xMDVjLTEuNTkzLDAtMi4zOSwwLjc0Ny0yLjM5LDIuMjQxCgljMCwxLjUyOCwwLjc5NywyLjI5MSwyLjM5LDIuMjkxaDUuMDNjMi4zOTEsMCw0LjIxNSwwLjYzMSw1LjQ3NywxLjg5MmMxLjI2MSwxLjI2MiwxLjg5MiwzLjA3MSwxLjg5Miw1LjQyOAoJYzAsMi4zOS0wLjYzMSw0LjIxNi0xLjg5Miw1LjQ3N2MtMS4yNjIsMS4yNjItMy4wODcsMS44OTItNS40NzcsMS44OTJIMTc5Ljc5MnogTTIwMy4zMjYsMTYxLjkxM3YtNS4wM2gxMi41OTkKCWMxLjU2LDAsMi4zNDEtMC43NzksMi4zNDEtMi4zNGMwLTEuNTI3LTAuNzgxLTIuMjkxLTIuMzQxLTIuMjkxaC01LjAyOWMtMi4zNTgsMC00LjE4My0wLjYzMS01LjQ3OC0xLjg5MgoJYy0xLjI5NS0xLjI2MS0xLjk0Mi0zLjA3MS0xLjk0Mi01LjQyOGMwLTIuMzU3LDAuNjM4LTQuMTY2LDEuOTE3LTUuNDI3YzEuMjc4LTEuMjYxLDMuMDk2LTEuODkzLDUuNDUzLTEuODkzaDEyLjg5N3Y1LjA4aC0xMS4xMDUKCWMtMS41OTMsMC0yLjM5LDAuNzQ3LTIuMzksMi4yNDFjMCwxLjUyOCwwLjc5NywyLjI5MSwyLjM5LDIuMjkxaDUuMDNjMi4zOTEsMCw0LjIxNSwwLjYzMSw1LjQ3NywxLjg5MgoJYzEuMjYxLDEuMjYyLDEuODkyLDMuMDcxLDEuODkyLDUuNDI4YzAsMi4zOS0wLjYzMSw0LjIxNi0xLjg5Miw1LjQ3N2MtMS4yNjIsMS4yNjItMy4wODcsMS44OTItNS40NzcsMS44OTJIMjAzLjMyNnoKCSBNMTY2Ljg5MywxNDcuNjcydjE0LjI0MmgtNi42NzN2LTE0LjI5MmMwLTEuNjkzLTAuMzczLTIuOTEzLTEuMTItMy42NmMtMC43NDctMC43NDctMS45NjctMS4xMi0zLjY2LTEuMTJoLTUuNTI3djE5LjA3MmgtNi42NzMKCXYtMjEuMjk0YzAtMS42NjEsMS4zNDYtMy4wMDcsMy4wMDctMy4wMDdoMTAuNTg3YzMuNTE4LDAsNi4wNzUsMC43OTcsNy42NjksMi4zOTFDMTY2LjA5NywxNDEuNTk2LDE2Ni44OTMsMTQ0LjE1MywxNjYuODkzLDE0Ny42NzIKCXogTTEwNS4wNjEsMTI4Ljg0OHY4Ljc2NGgtNS43NzdjLTQuMDE3LDAtNy4wNDYsMS4wMjEtOS4wODgsMy4wNjJjLTIuMDQxLDIuMDQyLTMuMDYzLDUuMDcyLTMuMDYzLDkuMDg4CgljMCw0LjAxNywxLjAyMSw3LjA0NiwzLjA2Myw5LjA4OGMyLjA0MSwyLjA0MSw1LjA3LDMuMDYzLDkuMDg4LDMuMDYzaDkuNDQzYzEuNjYxLDAsMy4wMDctMS4zNDYsMy4wMDctMy4wMDd2LTMwLjA1OEgxMDUuMDYxegoJIE0xMDUuMDYxLDE1Ni44MzRoLTMuOTg0Yy0yLjQ5LDAtNC4zLTAuNTU2LTUuNDI4LTEuNjY5Yy0xLjEyOS0xLjExMi0xLjY5My0yLjkxMy0xLjY5My01LjQwM3MwLjU2NC00LjI5OSwxLjY5My01LjQyOAoJYzEuMTI4LTEuMTI4LDIuOTM4LTEuNjkzLDUuNDI4LTEuNjkzaDMuOTg0VjE1Ni44MzR6IE01OS43OTMsMTM3LjYxMnYyMS4yOTRjMCwxLjY2MS0xLjM0NiwzLjAwNy0zLjAwNywzLjAwN0g0Ni40NDcKCWMtMy41MTksMC02LjA4NC0wLjc5Ny03LjY5NC0yLjM5Yy0xLjYxMS0xLjU5NC0yLjQxNS00LjE1LTIuNDE1LTcuNjY5di0xNC4yNDJoNi42NzN2MTQuMjkyYzAsMS42OTMsMC4zNzMsMi45MTMsMS4xMiwzLjY2CgljMC43NDcsMC43NDcsMS45NjcsMS4xMiwzLjY2LDEuMTJoNS4zMjh2LTE5LjA3Mkg1OS43OTN6IE0xNjkuOTg5LDE2MS45MTN2LTI0LjMwMWg2LjY3M3YyNC4zMDFIMTY5Ljk4OXogTTE3My4zMjUsMTI4Ljg0MQoJYy0xLjg0MiwwLTMuMzM2LDEuNDk0LTMuMzM2LDMuMzM2czEuNDk0LDMuMzM2LDMuMzM2LDMuMzM2czMuMzM2LTEuNDk0LDMuMzM2LTMuMzM2UzE3NS4xNjcsMTI4Ljg0MSwxNzMuMzI1LDEyOC44NDF6Ii8+Cjwvc3ZnPgo="
            />
            <div>
              <router-link
                :to="{ name: 'legals' }"
                class="text-decoration-none text-white"
                >{{ $t("footer.terms") }}</router-link
              >
            </div>
          </v-col>

          <template v-if="$isDesktop">
            <v-col cols="12" md="3" offset-md="1">
              <v-list
                nav
                class="pa-0"
                style="background: transparent"
                density="compact"
              >
                <v-list-item
                  v-for="(item, index) in footerlinks.slice(0, 4)"
                  :key="index"
                  @click="item.on"
                >
                  {{ item.label }}
                </v-list-item>
              </v-list>
            </v-col>

            <v-col cols="12" md="3" offset-md="1">
              <v-list nav class="pa-0" style="background: transparent">
                <v-list-item
                  v-for="(item, index) in footerlinks.slice(4)"
                  :key="index"
                  @click="item.on"
                >
                  {{ item.label }}
                </v-list-item>
              </v-list>

              <v-row dense>
                <v-col v-for="(item, index) in socials" :key="index" cols="2">
                  <v-btn
                    :aria-label="item.title"
                    icon
                    :href="item.url"
                    target="_blank"
                  >
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </template>
        </v-row>
      </v-container>
    </v-footer>

    <v-footer class="justify-center bg-grey-darken-4 mb-10 mb-md-0">
      <div class="my-3 text-center">
        {{ $t("footer.disclaimer") }}
      </div>
    </v-footer>
  </div>
</template>

<script>
import useFooterLinks from "./TheFooter/useFooterLinks";
import SocialLinks from "./TheFooter/SocialLinks";

export default {
  setup() {
    return {
      footerlinks: useFooterLinks(),
      socials: SocialLinks
    };
  }
};
</script>
