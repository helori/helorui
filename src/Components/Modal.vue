<template>
    <teleport to="body">
        <transition leave-active-class="duration-200">
            <div v-show="show" class="fixed inset-0 overflow-y-auto z-50" scroll-region>
                <transition enter-active-class="ease-out duration-200"
                        enter-from-class="opacity-0"
                        enter-to-class="opacity-100"
                        leave-active-class="ease-in duration-150"
                        leave-from-class="opacity-100"
                        leave-to-class="opacity-0">
                    <div
                        v-show="show"
                        class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity">
                    </div>
                </transition>

                <!-- Un clic à côté de la fenêtre la ferme -->
                <div class="relative min-h-full flex items-end sm:items-center justify-center p-4 sm:p-6"
                    @click.self="close">
                    <transition enter-active-class="ease-out duration-200"
                            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
                            leave-active-class="ease-in duration-150"
                            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
                            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <div v-show="show"
                            class="w-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10 transform transition-all"
                            :class="maxWidthClass">
                            <slot v-if="show"></slot>
                        </div>
                    </transition>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script>
import { defineComponent, onMounted, onUnmounted } from "vue";
export default defineComponent({
        emits: ['close'],
        props: {
            show: {
                default: false
            },
            maxWidthClass: {
                default: 'max-w-screen-lg'
            },
            closeable: {
                default: true
            },
        },
        watch: {
            show: {
                immediate: true,
                handler: (show) => {
                    if (show) {
                        document.body.style.overflow = 'hidden'
                    } else {
                        document.body.style.overflow = null
                    }
                }
            }
        },
        setup(props, {emit}) {
            const close = () => {
                if (props.closeable) {
                    emit('close')
                }
            }
            const closeOnEscape = (e) => {
                if (e.key === 'Escape' && props.show) {
                    close()
                }
            }
            onMounted(() => document.addEventListener('keydown', closeOnEscape))
            onUnmounted(() => {
                document.removeEventListener('keydown', closeOnEscape)
                document.body.style.overflow = null
            })
            return {
                close,
            }
        },
    })
</script>
