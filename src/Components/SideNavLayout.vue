<template>
    <!-- Remplit son parent, qui doit être positionné (relative ou absolute) -->
    <div class="absolute inset-0 bg-slate-50 dark:bg-slate-950">

        <aside class="absolute inset-y-0 left-0 z-20 w-full lg:w-64 overflow-y-auto pb-10 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700"
            v-if="menuOpened">

            <div class="flex items-center justify-between gap-2 px-5 pt-6 pb-2">
                <div class="min-w-0 text-lg font-bold text-slate-900 dark:text-white truncate">{{ title }}</div>
                <button type="button"
                    class="side-nav-toggle"
                    title="Masquer le menu"
                    @click="hideMenu">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                    </svg>
                </button>
            </div>

            <nav class="px-3">
                <template v-for="(group, index) in menu" :key="index">

                    <h3 v-if="group.title" class="side-nav-title">{{ group.title }}</h3>
                    <div v-else class="mt-4"></div>

                    <template v-for="link in group.links" :key="link.label">
                        <!-- Lien externe (voir le site…) -->
                        <a v-if="link.href"
                            :href="link.href"
                            :target="link.target ?? null"
                            class="side-nav-link"
                            :class="{'side-nav-link-danger': link.danger}">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="side-nav-icon" aria-hidden="true"
                                v-if="link.icon">
                                <path stroke-linecap="round" stroke-linejoin="round" :d="link.icon" />
                            </svg>
                            <span>{{ link.label }}</span>
                        </a>

                        <router-link v-else
                            :to="link.to"
                            class="side-nav-link"
                            :class="{'side-nav-link-danger': link.danger, 'side-nav-link-active': isActive(link)}"
                            @click="hideMenuIfMobile">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="side-nav-icon" aria-hidden="true"
                                v-if="link.icon">
                                <path stroke-linecap="round" stroke-linejoin="round" :d="link.icon" />
                            </svg>
                            <span>{{ link.label }}</span>
                        </router-link>
                    </template>

                </template>
            </nav>

        </aside>

        <div class="absolute inset-y-0 right-0"
            :class="menuOpened ? 'hidden lg:block lg:left-64' : 'left-0'">

            <div class="absolute top-0 inset-x-0 z-10 h-12 px-4 flex items-center gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-700"
                v-if="!menuOpened">
                <button type="button"
                    class="side-nav-toggle"
                    title="Afficher le menu"
                    @click="showMenu">
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
                <div class="font-bold text-slate-900 dark:text-white">{{ title }}</div>
            </div>

            <!-- Zone de contenu qui défile : les pages y posent leur marge (p-4 sm:p-8) -->
            <div class="absolute inset-x-0 bottom-0 overflow-y-auto"
                :class="menuOpened ? 'top-0' : 'top-12'">
                <slot></slot>
            </div>

        </div>

    </div>
</template>

<script>

import { defineComponent, ref } from "vue";

/**
 * Menu latéral et zone de contenu.
 * menu = [{ title?, links: [{ to (route vue-router) | href, label, icon (tracé Heroicons outline 24), target?, danger? }] }]
 * Le menu est décrit par un tableau, pas en HTML répété.
 */
export default defineComponent({

    props: {
        title: {
            type: String,
            required: true,
        },
        menu: {
            type: Array,
            required: true,
        },
    },

    setup()
    {
        const menuOpened = ref(!isMobile());

        function hideMenu()
        {
            menuOpened.value = false;
        }

        function showMenu()
        {
            menuOpened.value = true;
        }

        function hideMenuIfMobile()
        {
            if(isMobile())
            {
                hideMenu();
            }
        }

        function isMobile()
        {
            const lg = parseInt(window.tailwindcss?.theme?.screens?.lg ?? '1024px');
            return window.innerWidth <= lg;
        }

        return {
            menuOpened,
            hideMenu,
            showMenu,
            hideMenuIfMobile,
        }
    },

    methods: {
        // Les sous-pages (ex. /users/12) sont souvent des routes sœurs et non imbriquées :
        // router-link-active ne les rattache pas à leur lien, on compare donc les chemins.
        isActive(link)
        {
            if(!this.$route || !this.$router)
            {
                return false;
            }
            const path = this.$router.resolve(link.to).path;
            return this.$route.path === path || this.$route.path.startsWith(path + '/');
        },
    },
})

</script>
