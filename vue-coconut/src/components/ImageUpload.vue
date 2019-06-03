<template>
    <div id="app">
        <file-pond
                name="bin"
                ref="pond"
                label-idle="Drop files here or <span class='filepond--label-action'>Browse</span>"
                allow-multiple="false"
                max-files="1"
                server='http://localhost:3000/users/imgupload'
                accepted-file-types="image/jpeg, image/png"
                v-bind:files="myFiles"
                v-on:init="handleFilePondInit"
        />
    </div>
</template>

<script>
    // Import Vue FilePond
    import vueFilePond from 'vue-filepond'

    // Import FilePond styles
    import 'filepond/dist/filepond.min.css'

    // Import FilePond plugins
    // Please note that you need to install these plugins separately

    // Import image preview plugin styles
    import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'

    // Import image preview and file type validation plugins
    import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
    import FilePondPluginImagePreview from 'filepond-plugin-image-preview'

    // Create component
    const FilePond = vueFilePond(
        FilePondPluginFileValidateType,
        FilePondPluginImagePreview
    );
    export default {
        name: "ImageUpload",
        data: function() {
            return {
                myFiles: ['my-file.jpg']
            };
        },
        methods: {
            handleFilePondInit: function() {
                console.log('FilePond has initialized');

                // FilePond instance methods are available on `this.$refs.pond`
            },
            onload (e, r) {
                console.log(r)
            }
        }
    }
</script>

<style scoped>

</style>