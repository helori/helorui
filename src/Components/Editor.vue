<template>

    <div class="editor flex flex-col gap-1 rounded-md">

        <!--div class="flex items-center gap-1">
            <button
                type="button"
                class="btn btn-white text-xs"
                @click="toggleFullscreen">
                {{ $t('Open fullscreen editor') }}
            </button>

            <button
                type="button"
                class="btn btn-white text-xs"
                @click="openHelp">
                {{ $t('Open editor help') }}
            </button>
        </div-->

        <div ref="container" class="flex-grow">
            <textarea ref="editorElt"></textarea>
        </div>

        <dialog-modal
            ref="helpDialog"
            max-width-class="max-w-screen-sm">
            <template #title>
                {{ $t('Editor help') }}
            </template>
            <template #content>
                <div class="font-bold mb-2">
                    {{ $t('Fullscreen mode') }}
                </div>
                <div class="mb-4">
                    {{ $t('The editor window can be expanded to fullscreen mode to allow you to enter large volumes of text. Click "Open fullscreen editor" to expand the window. To minimise the window, click the icon ') }}

                    <img :src="asset('assets/fullscreen-icon.png')"
                        class="inline h-5"
                        alt="{{ $t('Fullscreen icon') }}">

                    {{ $t('on the upper ribbon, or press "Ctrl + Shift + F"') }}
                </div>
                <div class="font-bold mt-4 mb-2">
                    {{ $t('Paste') }}
                </div>
                <div class="mb-4">
                    {{ $t('You can paste information into the text editor from an existing document. Please bear in mind that when pasting, formatting may not be preserved. Please review the formatting of the text you have pasted, paying particular attention to tables (including merged cells), numbered lists and text effects.') }}
                </div>
                <div class="font-bold mt-4 mb-2">
                    {{ $t('Tables') }}
                </div>
                <div class="mb-4">
                    {{ $t('If you want to include tables in your response, it is highly recommended that you avoid pasting tables from other documents and instead create tables using the text editor. The editor allows you to create any number of tables in a field, add or delete rows and columns, merge and un-merge cells and perform other operations. While the editor does not provide functionality to style cell borders, those will be automatically rendered by the system when creating the notification preview. Creating tables using the editor will ensure that their formatting is correctly recorded in the database and reflected on your notification.') }}
                </div>
                <div class="font-bold mt-4 mb-2">
                    {{ $t('Line breaks') }}
                </div>
                <div class="mb-4">
                    {{ $t('Press "Enter" to create a line break that will separate paragraphs and create a space between them. If you would like to create a new line inside the current paragraph without spacing, press "Shift + Enter".') }}
                </div>
                <!--div class="font-bold mt-4 mb-2">
                    {{ $t('More help') }}
                </div>
                <a class="content-link"
                    @click="openEditorHelp">
                    {{ $t('Show editor help') }}
                </a-->

            </template>
            <template #footer>
                <div class="flex items-center gap-2 justify-end">
                    <button
                        type="button"
                        class="btn btn-white"
                        @click="closeHelp">
                        {{ $t('Close') }}
                    </button>
                </div>
            </template>
        </dialog-modal>
    </div>

</template>

<script>

import { defineComponent, ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import useDarkMode from '../Functions/useDarkMode.js'
import useAsset from '../Functions/useAsset.js'

import 'tinymce/tinymce'
//import 'tinymce/skins/ui/oxide/skin.min.css'
//import 'tinymce/skins/content/default/content.min.css'
import 'tinymce/icons/default/icons'
import 'tinymce/themes/silver/theme'
import 'tinymce/models/dom/model'


export default defineComponent(
{
    props: {
        html: {
            required: true,
        },
        init: {
            type: Object,
            required: false,
        },
        height: {
            type: Number,
            default: 300,
        },
        tables: {
            type: Boolean,
            default: true,
        },
    },

    emits: [
        'update:html',
    ],

    setup(props, { emit })
    {
        const container = ref(null);
        let editorHeight = props.height;

        const editorElt = ref(null);
        let editor = null;
        let isFullscreen = false;

        const { isDark } = useDarkMode();
        const { locale } = useI18n({ useScope: 'global' })

        watch(() => props.html, (newContent) => {
            if(editor){
                const content = editor.getContent();
                if(content !== newContent){
                    editor.setContent(newContent ?? '');
                }
            }
        });

        watch(() => isDark.value, (newIsDark) => {
            render();
        });

        watch(() => locale.value, (newLocale) => {
            render();
        });

        onMounted(function()
        {
            /*new ResizeObserver(function(){
                updateContainerSize();
            }).observe(container.value);*/

            init();
        });

        function updateContainerSize()
        {
            editorHeight = props.height;
            if(container.value)
            {
                editorHeight = Math.floor(container.value.clientHeight);
            }
            if(editor){
                render();
            }
        }

        function init()
        {
            tinymce.init(editorOptions()).then((editors) => {

                editor = editors[0];
                editor.setContent(props.html ?? '');

                // Event never received ?!
                /*editor.on('init', (e) => {
                    updateContainerSize();
                });*/

                editor.on('change', (e) => {
                    emit('update:html', editor.getContent());
                    //console.log(editor.getContent());
                });

                editor.on('input', (e) => {
                    emit('update:html', editor.getContent());
                });

                editor.on('FullscreenStateChanged', (e) => {
                    isFullscreen = e.state;
                });

                editor.on('keydown', (e) => {
                    if(e.key === 'Escape' && isFullscreen){
                        toggleFullscreen();
                    }
                });
            });
        }

        function render()
        {
            // From TinyMCE 7, refreshing the editor config is done by recreating it
            if(editor){
                tinymce.remove(editor);
                init();
            }
        }

        function getSkin()
        {
            return isDark.value ? 'oxide-dark' : 'oxide';
        }

        function getContentCss()
        {
            return isDark.value ? 'dark' : 'default';
        }

        function getLanguage()
        {
            // Manually rename file fr_FR.js to fr.js (and its content)
            return locale.value;
            //return locale.value === 'fr' ? 'fr_FR' : locale.value;
        }

        function toggleFullscreen()
        {
            editor.execCommand('mceFullScreen');
        }

        const helpDialog = ref(null);

        function openHelp()
        {
            helpDialog.value.open();
        }

        function openEditorHelp()
        {
            helpDialog.value.close();
            editor.execCommand('mceHelp');
        }

        function closeHelp()
        {
            helpDialog.value.close();
        }

        const { asset } = useAsset();

        function editorOptions()
        {
            let options = {
                license_key: 'gpl', // use the free self-hosted version of TinyMCE
                target: editorElt.value,

                base_url: asset('tinymce'), // Laravel valet deploys assets in S3 storage
                language : getLanguage(),
                skin: getSkin(),
                content_css: getContentCss(),
                content_style: '.tinymce-body { font-size: 0.875rem; } .tinymce-body p { margin: 5px 0; }', // text-sm
                //content_style: '.tinymce-body { font-size: 1rem; }', // text-base

                plugins: 'fullscreen link lists table code help', //'autoresize lists link image table code help wordcount',
                //toolbar: 'undo redo | bold underline italic link removeformat | bullist numlist outdent indent | table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | fullscreen code', // paste forecolor backcolor | fontsize bold italic | alignleft aligncenter alignright alignjustify code
                //toolbar2: 'table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',

                contextmenu: "paste | link image inserttable | cell row column deletetable",

                height: editorHeight,
                resize: true,
                body_class: 'tinymce-body',
                inline: false,
                menubar: false,
                relative_urls: false,
                convert_urls: false,
                statusbar: false,
                style_formats_merge: true,
                preview_styles: false,
                fullscreen_native: false,

                forced_root_block: 'p', // default block element used to wrap non block elements and text nodes
                newline_behavior: 'default', // use forced_root_block when pressing enter, and <br> pressing Shift+Enter

                // core "paste" plugin :
                paste_as_text: false, // keep tables
                paste_block_drop: false,
                paste_merge_formats: true, // simplify HTML by merging format options
                paste_tab_spaces: 4,
                smart_paste: true, // transform URL to links and image URL to image
                paste_data_images: false, // remove inline images (data:url)

                valid_elements: 'div,span,p,br,strong,em,span[style],b,i,a[href],ol,ul,li,table,thead,tbody,tr,th[colspan|rowspan],td[colspan|rowspan]',
                valid_styles: 'text-align text-decoration font-weight font-style',
                //invalid_elements: '',
                //invalid_styles: 'color font-size font-family mso-bidi-font-size',
                //convert_fonts_to_spans: false, // deprecated
                allow_conditional_comments: false,

                // Modify the pasted content before it gets inserted into the editor :
                /*paste_preprocess: (ed, data) => {

                    purifyData.value = {
                        html: data.content // html content
                    }

                    purifySend('post', '/api/purify').then(r => {

                        // This is the expected way to set the content,
                        // but it doesn't work using promises
                        // either synchronously or asynchronously.
                        // => Instead, we use the setContent() method

                        // data.content = r.data;
                        editor.setContent(r.data);
                    });

                    //data.content = data.content;
                },*/

                // Modify the pasted content before it gets inserted into the editor,
                // but after it’s been parsed into a DOM structure.
                /*paste_postprocess: (ed, data) => {
                    const node = data.node; // main node
                    //console.log('paste_postprocess', node);
                    // do sth with node :
                    // args.node.setAttribute('id', '42');
                    data.node = node;
                },*/
            };

            if(props.tables){
                options.toolbar = 'undo redo | bold underline italic link removeformat | bullist numlist outdent indent | fullscreen code | table';
                // tabledelete | tableprops tablerowprops tablecellprops tablemergecells | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol
            }else{
                options.toolbar = 'bold underline italic link removeformat | bullist numlist outdent indent | fullscreen code';
            }

            return options;
        }

        return {
            container,
            editorElt,
            toggleFullscreen,

            helpDialog,
            closeHelp,
            openHelp,
            openEditorHelp,

            asset,
        };
    }
})
</script>

