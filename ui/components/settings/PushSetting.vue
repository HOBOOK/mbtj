<template>
<div>
    <v-list-item>
        <v-list-item-content>
            {{ $t('setting_push') }}
        </v-list-item-content>
        <v-list-item-action>
            <Dialog 
                :title="$t('setting_push_app_add')" 
                @click-yes="createItem()" 
                :clickYesBtn="$t('add')"
                :disabledYes="!validateCreate"
            >
                <template v-slot:button="{on, attrs}">
                    <v-btn v-on="on" v-bind="attrs">{{ $t('setting_push_app_add') }}</v-btn>
                </template>

                <template v-slot:content>
                    <data-input :title="$t('setting_push_app_item_title')" v-model="createItemTitle"/>
                    <data-input :title="$t('setting_push_app_item_description')" v-model="createItemDescription"/>
                    <data-input :title="$t('setting_push_app_item_webhook_url')" v-model="createItemWebhookUrl"/>

                    <v-row no-gutters align="center" class="py-4">
                        <v-btn color="primary" :loading=loadingTest @click="testPush(createItemWebhookUrl)" :disabled="!createItemWebhookUrl">
                            <v-icon left>mdi-heart-pulse</v-icon>
                            {{ $t('test_push') }}
                        </v-btn>

                        <v-spacer/>

                        <span>
                            <v-icon left :color="pushTestResult ? 'green' : 'red'">{{ pushTestResult ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}</v-icon>
                            {{ pushTestResult ? $t('success') : $t('failure') }}
                        </span>

                    </v-row>
                    
                </template>
            </Dialog>
        </v-list-item-action>
    </v-list-item>

    <v-list-item>
        <v-list-item-content>
            <v-list-item-title>
                {{ $t('setting_push_app') }}

                <span class="text-caption grey--text mx-1">{{ $t('setting_push_app_description') }}</span>
            </v-list-item-title>
        </v-list-item-content>
    </v-list-item>
    
    <v-list-item>
        <v-list-item-content>
            <v-col cols="12" no-gutters jusitfy="center" v-for="item in items" :key="item._id">
                <v-hover v-slot="{hover}">
                    <v-card class="expanded">
                        <v-card-title>
                            <v-row no-gutters>
                                {{item.title}}
                                <v-spacer/>

                                <v-btn v-if="hover" @click="selectedItem = item, $refs.editDialog.dialog = true" small tile icon><v-icon>mdi-pencil</v-icon></v-btn>


                                <check-dialog v-if="hover" :yesText="$t('delete')" yesColor="warning" :text="$t('setting_push_app_delete_message')">
                                    <template v-slot:button="{on, attrs}">
                                        <v-btn small tile icon v-on="on" v-bind="attrs">
                                            <v-icon>mdi-close</v-icon>
                                        </v-btn>
                                    </template>
                                </check-dialog>

                            </v-row>
                        </v-card-title>
                        <v-card-subtitle v-if="item.description">
                            {{ item.description }}
                        </v-card-subtitle>
                        <v-card-text>
                            <v-list-item class="px-0">
                                <v-list-item-icon>
                                    <v-icon>mdi-webhook</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    {{ item.webhookUrl }}

                                    <v-list-item-subtitle>
                                        {{ item.createdAt }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                        </v-card-text>
                    </v-card>
                </v-hover>

            </v-col>
        </v-list-item-content>
    </v-list-item>

    <Dialog 
        :title="$t('setting_push_app_edit')" 
        @click-yes="editItem()" 
        :clickYesBtn="$t('edit')"
        :disabledYes="!validateEdit"
        ref="editDialog"
    >
        <template v-slot:content>
            <div v-if="selectedItem">
                <data-input :title="$t('setting_push_app_item_title')" v-model="selectedItem.title"/>
                <data-input :title="$t('setting_push_app_item_description')" v-model="selectedItem.description"/>
                <data-input :title="$t('setting_push_app_item_webhook_url')" v-model="selectedItem.webhookUrl"/>

                <v-row no-gutters align="center" class="py-4">
                    <v-btn color="primary" :loading=loadingTest @click="testPush(selectedItem.webhookUrl)" :disabled="!selectedItem.webhookUrl">
                        <v-icon left>mdi-heart-pulse</v-icon>
                        {{ $t('test_push') }}
                    </v-btn>

                    <v-spacer/>

                    <span>
                        <v-icon left :color="pushTestResult ? 'green' : 'red'">{{ pushTestResult ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}</v-icon>
                        {{ pushTestResult ? $t('success') : $t('failure') }}
                    </span>

                </v-row>
            </div>
        </template>
    </Dialog>
    
</div>
</template>

<script>
export default{
    name: 'PushSetting',
    data() { return {
        loading: false,
        items:[],

        createItemTitle:'',
        createItemDescription:'',
        createItemWebhookUrl:'',

        loadingTest: false,
        pushTestResult:false,

        selectedItem: null

    }},
    computed:{
        validateCreate() {
            return this.createItemTitle && this.createItemDescription && this.createItemWebhookUrl && this.pushTestResult
        },
        validateEdit() {
            return this.selectedItem && this.selectedItem.title && this.selectedItem.description && this.selectedItem.webhookUrl && this.pushTestResult
        }
    },
    mounted(){
        this.getItems()
    },
    methods:{
        async getItems() {
            this.loading = true

            await this.$axios.get('/v1/push')
            .then(res=>{
                this.items = res.data
            })
            .catch(err=>{
                console.log(err)
            })

            this.loading = false
        },

        async createItem() {
            this.loading = true

            if(!this.validateCreate) {
                this.$snotify.error(this.$t('request_error_message'))
            }

            if(this.items.length >= 5) {
                this.$snotify.warning(this.$t('setting_push_app_restrict_create_message'))
                return
            }

            await this.$axios.post('/v1/push', {
                title: this.createItemTitle,
                description: this.createItemDescription,
                webhookUrl: this.createItemWebhookUrl
            })
            .then(res=>{
                this.items.push(res.data)

                this.$snotify.success(this.$t('request_success_message'))
            })
            .catch(err=>{
                console.log(err)
                this.$snotify.error(this.$t('request_error_message'))
            })

            this.loading = false
        },

        async editItem() {
            this.loading = true

            if(!this.validateEdit) {
                this.$snotify.error(this.$t('request_error_message'))
            }

            await this.$axios.put('/v1/push', {
                _id: this.selectedItem._id,
                title: this.selectedItem.title,
                description: this.selectedItem.description,
                webhookUrl: this.selectedItem.webhookUrl
            })
            .then(res=>{
                this.selectedItem = res.data

                this.$snotify.success(this.$t('request_success_message'))
            })
            .catch(err=>{
                console.log(err)
                this.$snotify.error(this.$t('request_error_message'))
            })

            this.loading = false
        },

        async deleteItem(item) {
            this.loading = true

            await this.$axios.delete('/v1/push/' + item._id)
            .then(res=>{
                this.items.splice(this.items.indexOf(item), 1)
                
                this.$snotify.success(this.$t('request_success_message'))
            })
            .catch(err=>{
                console.log(err)
                this.$snotify.error(this.$t('request_error_message'))
            })

            this.loading = false
        },

        async testPush(webhookUrl) {
            this.loadingTest = true

            this.pushTestResult = false
            await this.$axios.post('/v1/push/test',{
                url: webhookUrl
            })
            .then(res=>{
                if(res.data) {
                    this.pushTestResult = res.data
                    this.$snotify.success(this.$t('request_success_message'))
                } else {
                    this.$snotify.error(this.$t('request_error_message'))
                }
            })
            .catch(err=>{
                console.log(err)
                this.$snotify.error(this.$t('request_error_message'))
                
            })

            this.loadingTest = false
        }
    }
}
</script>
