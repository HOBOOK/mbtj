<template>
    <Dialog hide-overlay>
        <template v-slot:title>
        <v-icon color="yellow" left>mdi-lightning-bolt-outline</v-icon>
        {{ $t("setting_developer_mode") }}
        </template>
        <template v-slot:button="{ on, attrs }">
        <v-btn v-on="on" v-bind="attrs" tile small icon class="mr-2">
            <v-icon color="yellow">mdi-lightning-bolt-outline</v-icon>
        </v-btn>
        </template>

        <template v-slot:content>
        <v-col cols="12">
            <Tab :items="[{ text: $t('test'), name: 'test' }]" :fixed="false">
            <template v-slot:test>
                <v-list>
                <v-list-item>
                    <v-list-item-content>
                    알람 상황 발생 테스트
                    </v-list-item-content>

                    <v-list-item-action>
                    <v-btn @click="testAlarm" :loading="loadingTest"
                        >실행</v-btn
                    >
                    </v-list-item-action>
                </v-list-item>
                </v-list>
            </template>
            </Tab>
        </v-col>
        </template>
    </Dialog>
</template>

<script>

export default{
    name: 'DataManageDialog',
    
    data() {
        return {
            loadingTest: false,
        }
    },

    mounted(){

    },

    methods:{
            
        /**
         * 개발 모드 테스트 함수
         */

        async testAlarm() {
        this.loadingTest = true;
        await this.$axios
            .post("/v1/test/alarm")
            .then((res) => {
            //this.$snotify.success(this.$t("request_success_message"));
            })
            .catch((err) => {
            console.log(err);
            this.$snotify.error(this.$t("request_error_message"));
            });
        this.loadingTest = false;
        },
    }
}
</script>