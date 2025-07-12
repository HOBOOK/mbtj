<template>
  <div>
    <Dialog
      line-theme
      :width="880"
      :height="600"
      :max-height="600"
      :saveBtn="showSaveBtn"
      @saved="saveInput"
      v-model="dialog"
      ref="settingDialog"
    >
      <template v-slot:title>
        <v-icon left dense>mdi-cog-outline</v-icon>
        {{ $t("settings") }}
        <v-spacer />

        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-text-field
              v-on="on"
              v-model="keyword"
              prepend-inner-icon="mdi-magnify"
              dense
              solo
              hide-details
              :placeholder="$t('search_hint')"
              style="max-width: 320px"
              :max-length="50"
              autocomplete="new-password"
              @keydown.enter.prevent="onEnterSearch()"
            ></v-text-field>
          </template>

          <v-list v-if="searchedList.length > 0">
            <v-list-item
              v-for="(item, index) in searchedList"
              :key="'searched-' + index"
              @click="onClickItem(null, item), (keyword = '')"
            >
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      
      <template v-slot:button="{ on, attrs }">
        <div v-on="on" v-bind="attrs">
          <slot name="activator"></slot>
        </div>
      </template>

      <template v-slot:content>
        <v-row no-gutters :key="settingKey" style="position: relative; height:100%;">
          <v-col cols="3">
            <item-tree
              :items="settings"
              @click:item="onClickItem"
              :selectedItems="selectedSettings"
              class="ma-2"
              openTree
            />
          </v-col>
          <v-divider vertical class="py-0" />
          <v-col cols="9">
            <v-card v-if="selectedSetting" flat color="transparent">
              <!-- 헤더 영역 -->
              <v-card-title>
                {{ $t("setting_" + selectedSetting.id) }}

                <span class="text-caption ml-2 grey--text">
                  {{ $t("setting_" + selectedSetting.id + "_description") }}
                </span>

                <v-row
                  justify="end"
                  no-gutters
                  align="center"
                  class="pr-1"
                  style="height: 32px"
                >
                  <v-btn
                    v-if="selectedSetting?.id === 'user_management'"
                    @click="openAddModal"
                  >
                    <span>{{ $t("add_user") }}</span>
                  </v-btn>
                  <div
                    v-if="selectedSetting?.id === 'system_log'"
                    class="d-flex justify-center"
                  >
                    <data-select
                      :items="Object.values(memberData)"
                      :placeholder="$t('user_choice')"
                      dense
                      solo
                      small
                      style="max-width: 150px; font-size: 0.9rem"
                      hide-details
                      @change="showMemberHistory"
                      item-color="primary"
                      clearable
                    ></data-select>
                  </div>

                </v-row>
              </v-card-title>

              <v-divider />

              <div
                class="setting-dialog-content"
                style="
                  height: 100%;
                  max-height: 100%;
                  overflow-y: auto;
                  overflow-x: hidden;
                "
              >
                <!-- 콘텐츠 영역 -->
                <div v-if="selectedSetting?.type === 'root'">
                  <v-card-title>
                    {{ $t("list") }}
                  </v-card-title>
                  <item-tree
                    :items="selectedSetting.children"
                    @click:item="onClickItem"
                    :selectedItems="selectedSettings"
                    openTree
                  />
                </div>

                <v-list v-else color="transparent" class="ma-0 pa-0">
                  <div
                    v-for="item in selectedSetting.settingItems"
                    :key="item.name"
                  >
                    <v-list-item v-if="!item.custom">
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ $t("setting_" + item.name) }}
                        </v-list-item-title>
                      </v-list-item-content>

                      <v-list-item-action>
                        <data-select
                          v-if="item.type === 'select'"
                          :items="item.items"
                          @input="item.input"
                          dense
                          :style="
                            'max-width:' +
                            (item.maxWidth ? item.maxWidth : 180) +
                            'px;'
                          "
                          v-model="item.model"
                          hide-details
                        >
                          <template v-slot:selection="{ item }">
                            {{ $t("setting_" + item) }}
                          </template>
                          <template v-slot:item="{ item }">
                            {{ $t("setting_" + item) }}
                          </template>
                        </data-select>

                        <data-input
                          v-else-if="
                            item.type === 'text' || item.type === 'number'
                          "
                          @input="item.input"
                          dense
                          :style="
                            'max-width:' +
                            (item.maxWidth ? item.maxWidth : 180) +
                            'px;'
                          "
                          v-model="item.model"
                          hide-details
                          :type="item.type"
                        >
                        </data-input>
                      </v-list-item-action>
                    </v-list-item>

                    <div v-else>
                      <PushSetting v-if="item.type === 'push'" />
                    </div>
                  </div>

                  <empty
                    v-if="selectedSetting.settingItems?.length === 0"
                    icon="mdi-cog-off-outline"
                    :subtext="$t('setting_no_message')"
                  />
                </v-list>

                <!-- 프로필 설정 -->
                <div
                  v-if="selectedSetting?.id === 'profile'"
                  color="transparent"
                  class="ma-0 pa-0"
                >
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ $t("setting_profile_image") }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <!-- 프로필 이미지 설정 -->
                  <v-list-item>
                    <v-list-item-avatar
                      :size="140"
                      class="mt-1 ml-1 mr-5 mb-5"
                      @click="openProfileModal"
                    >
                      <profile-avatar
                        :user="user"
                        :size="140"
                        :imageURL="profileImage"
                        style="cursor: pointer"
                      ></profile-avatar>
                    </v-list-item-avatar>
                  </v-list-item>

                  <v-dialog
                    v-model="profileModalOpen"
                    max-width="500"
                    class="my-auto"
                  >
                    <v-card>
                      <v-card-title class="mb-4">
                        <strong>{{ $t("setting_profile_image") }}</strong>
                      </v-card-title>

                      <v-card-text>
                        <v-list-item-avatar
                          size="180"
                          style="
                            background-color: rgba(0, 0, 0, 0.1);
                            display: flex;
                            justify-content: center;
                            align-items: center;
                          "
                          class="ma-auto mt-3 mb-4"
                        >
                          <profile-avatar
                            :user="user"
                            :imageURL="imageURL"
                            :size="180"
                          ></profile-avatar>
                        </v-list-item-avatar>
                      </v-card-text>

                      <v-card-text>
                        <input
                          ref="modalProfileImageInput"
                          type="file"
                          accept="image/*"
                          style="display: none"
                          :key="selectedImage ? new Date().getTime() : ''"
                          @input="setSelectedImage"
                        />
                        <div
                          class="file-name-container"
                          style="display: flex; align-items: center"
                        >
                          <v-text-field
                            readonly
                            dense
                            outlined
                            placeholder="직접 업로드(500KB 미만)"
                            :value="selectedImage ? selectedImage.name : ''"
                            @click="$refs.modalProfileImageInput.click()"
                          >
                            <template v-slot:prepend-inner>
                              <v-icon
                                :color="selectedImage ? 'primary' : ''"
                                left
                                >mdi-paperclip
                              </v-icon>
                            </template>

                            <template v-if="selectedImage">
                              <v-icon
                                slot="append"
                                @click="selectedImage = null"
                                color="primary"
                                style="cursor: pointer"
                              >
                                mdi-close
                              </v-icon>
                            </template>
                          </v-text-field>
                        </div>
                      </v-card-text>

                      <v-card-actions class="mb-1">
                        <v-spacer />
                        <v-btn text @click="profileModalOpen = false">{{
                          $t("close")
                        }}</v-btn>
                        <v-btn
                          text
                          color="primary"
                          @keydown.enter="setProfileImage"
                          @click="setProfileImage"
                          >{{ $t("save") }}</v-btn
                        >
                   
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

                  <!-- 프로필 이름 설정 -->
                  <div class="pr-4 pl-4 ma-0 mb-3">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ $t("setting_profile_name") }}
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-text-field
                      id="nameInput"
                      dense
                      outlined
                      autofocus
                      hide-details
                      style="width: 300px"
                      v-model="profileName"
                      :append-icon="
                        $regular.name(profileName) ? 'mdi-check' : ''
                      "
                      :rules="rulesOn ? [rules.name] : []"
                      :maxlength="50"
                      @input="
                        () => {
                          rulesOn = false;
                        }
                      "
                      @keydown.enter="setProfileName"
                    ></v-text-field>
                  </div>

                  <div class="pr-4 pl-4 ma-0 mb-3">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ $t("login_email") }}
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-text-field
                      dense
                      outlined
                      autofocus
                      hide-details
                      style="width: 300px"
                      :value="user.email"
                      readonly
                    ></v-text-field>
                  </div>
                </div>

                <!-- 비밀번호 변경 -->
                <div
                  v-if="selectedSetting?.id === 'security'"
                  color="transparent"
                  class="ma-0 pa-0"
                >
                  <div class="pr-4 pl-4 ma-0 mt-1 mb-3">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ $t("current_password") }}
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-text-field
                      id="passwordInput1"
                      v-model="currentPassword"
                      type="password"
                      :append-icon="currentPasswordCheck ? 'mdi-check' : ''"
                      dense
                      outlined
                      :placeholder="$t('current_password')"
                      prepend-inner-icon="mdi-lock-outline"
                      autofocus
                      style="max-width: 300px; font-size: 1rem"
                      :maxlength="20"
                      hide-details
                      @input="checkCurrentPassword"
                      @keyup.enter="setPassword"
                      autocomplete="new-password"
                    ></v-text-field>
                  </div>

                  <div class="pr-4 pl-4 ma-0 mb-3">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ $t("new_password") }}
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-text-field
                      id="passwordInput2"
                      v-model="newPassword"
                      type="password"
                      :append-icon="
                        $regular.passwordPatten(newPassword) ? 'mdi-check' : ''
                      "
                      dense
                      outlined
                      :placeholder="$t('new_password')"
                      prepend-inner-icon="mdi-lock-outline"
                      style="max-width: 300px; font-size: 1rem"
                      :maxlength="20"
                      :rules="
                        rulesOn ? [rules.passwordRequired, rules.password] : []
                      "
                      hide-details
                      @input="
                        () => {
                          rulesOn = false;
                        }
                      "
                      @keyup.enter="setPassword"
                      autocomplete="new-password"
                    ></v-text-field>
                  </div>

                  <div class="pr-4 pl-4 ma-0">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ $t("confirm_new_password") }}
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-text-field
                      id="passwordInput3"
                      v-model="confirmNewPassword"
                      type="password"
                      :append-icon="
                        confirmNewPassword === newPassword &&
                        newPassword.length > 8
                          ? 'mdi-check'
                          : ''
                      "
                      dense
                      outlined
                      :placeholder="$t('confirm_new_password')"
                      prepend-inner-icon="mdi-lock-outline"
                      style="max-width: 300px; font-size: 1rem"
                      :maxlength="20"
                      :rules="rulesOn ? [rules.passwordOk1] : []"
                      hide-details
                      @input="
                        () => {
                          rulesOn = false;
                        }
                      "
                      @keyup.enter="setPassword"
                      autocomplete="new-password"
                    ></v-text-field>
                  </div>
                </div>

                <!-- 활동 기록 보기 -->
                <div v-if="selectedSetting?.id === 'history'" class="ma-0 pa-0">
                  <data-table
                    :headers="[
                      {
                        text: $t('type'),
                        value: 'eventType',
                      },
                      {
                        text: $t('message'),
                        value: 'message',
                      },
                      {
                        text: $t('date'),
                        align: 'start',
                        sortable: true,
                        value: 'creationTime',
                      },
                    ]"
                    :items="history"
                    :items-per-page="10"
                    class="elevation-1"
                    disable-sort
                    dense
                  >
                  </data-table>
                </div>

                <!-- 계정 탈퇴 -->
                <div
                  v-if="selectedSetting?.id === 'delete_account'"
                  color="transparent"
                  class="ma-0 pa-0"
                >
                  <v-list-item class="px-1">
                    <v-list-item-action>
                      <v-btn
                        @click="openDeleteModal"
                        @keydown.enter="openDeleteModal"
                        text
                      >
                        <v-icon class="red--text mr-1" size="18"
                          >mdi-trash-can-outline</v-icon
                        >
                        <span class="red--text mr-1">{{
                          $t("setting_delete_account")
                        }}</span>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>

                  <v-dialog
                    v-model="deleteModalOpen"
                    max-width="500"
                    class="my-auto"
                  >
                    <v-card>
                      <v-card-title class="mb-4">
                        <strong>
                          {{ $t("setting_delete_account") }}
                        </strong>
                      </v-card-title>

                      <v-card-text class="mt-5">
                        <span class="red--text" style="font-size: 1rem">
                          <v-icon class="mr-1 red--text" size="20"
                            >mdi-alert-circle-outline</v-icon
                          >
                          {{ $t("delete_account_message") }}
                        </span>
                      </v-card-text>

                      <v-card-text>
                        <div class="ma-0 mb-3">
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ $t("login_password") }}
                            </v-list-item-title>
                          </v-list-item-content>
                          <v-text-field
                            v-model="deletePassword"
                            type="password"
                            dense
                            outlined
                            :placeholder="$t('rules_password')"
                            prepend-inner-icon="mdi-lock-outline"
                            autofocus
                            style="font-size: 1rem"
                            :maxlength="20"
                            hide-details
                            @keydown.enter="deleteAccount"
                          ></v-text-field>
                        </div>
                      </v-card-text>

                      <v-card-actions class="mb-1">
                        <v-spacer />
                        <v-btn text @click="deleteModalOpen = false">{{
                          $t("close")
                        }}</v-btn>
                        <v-btn text color="red" @click="deleteAccount">{{
                          $t("delete_account")
                        }}</v-btn>
                 
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </div>

                <!-- 사용자 관리 -->
                <div
                  v-if="selectedSetting?.id === 'user_management'"
                  class="ma-0 pa-0"
                >
                  <data-table
                    :hide-default-header="false"
                    :items-per-page="-1"
                    :headers="[
                      {
                        text: $t('name'),
                        value: 'name',
                      },
                      {
                        text: $t('status'),
                        value: 'status',
                      },
                      {
                        text: $t('grade'),
                        value: 'role',
                      },
                      {
                        text: $t('creation_date'),
                        align: 'start',
                        sortable: true,
                        value: 'signupDate',
                      },
                      {
                        text: $t('setting_password'),
                        value: 'password',
                      },
                    ]"
                    :items="member"
                    class="elevation-1"
                    disable-sort
                    dense
                  >
                    <template v-slot:item.name="{ item }">
                      <div class="d-flex align-center">
                        <profile-avatar
                          :user="item"
                          :size="26"
                          :show-name="true"
                          :show-email="true"
                          style="margin-top: 4px; margin-bottom: 4px"
                        ></profile-avatar>
                      </div>
                    </template>

                    <template v-slot:item.status="{ item }">
                      <div>
                        <v-chip
                          outlined
                          label
                          small
                          @click="openStatusModal(item)"
                          style="padding-left: 11px; padding-right: 11px"
                          :class="getUserStatusClass(item)"
                        >
                          <v-icon
                            v-if="item.status === 'ACTIVE'"
                            dense
                            color="green"
                            small
                            left
                            class="mr-1"
                            >mdi-check-circle-outline</v-icon
                          >
                          <v-icon
                            v-else-if="
                              item.status === 'BLOCK' ||
                              item.status === 'DELETE'
                            "
                            dense
                            color="error"
                            small
                            left
                            class="mr-1"
                            >mdi-close-circle-outline</v-icon
                          >
                          <v-icon
                            v-else
                            dense
                            color="error"
                            small
                            left
                            class="mr-1"
                            >mdi-alert-circle-outline</v-icon
                          >
                          {{ item.selectedStatus }}
                        </v-chip>
                      </div>
                    </template>

                    <template v-slot:item.role="{ item }">
                      <div>
                        <v-chip
                          outlined
                          label
                          small
                          style="padding-left: 11px; padding-right: 11px"
                          @click="openRoleModal(item)"
                          :class="getUserRoleClass(item)"
                        >
                          <v-icon
                            v-if="item.role === 'MASTER'"
                            dense
                            small
                            left
                            class="mr-1"
                            color="orange"
                            >mdi-shield-star</v-icon
                          >
                          <v-icon
                            v-else-if="item.role === 'ADMIN'"
                            dense
                            small
                            left
                            class="mr-1"
                            color="primary"
                            >mdi-shield-account</v-icon
                          >
                          <v-icon
                            v-else
                            dense
                            small
                            left
                            color="grey"
                            class="mr-1"
                            >mdi-account-circle</v-icon
                          >
                          <span style="color=black !important">{{
                            item.selectedRole
                          }}</span>
                        </v-chip>
                      </div>
                    </template>

                    <template v-slot:item.password="{ item }">
                      <v-btn
                        text
                        icon
                        small
                        @click="openPasswordModal(item)"
                        :class="getUserPasswordClass(item)"
                      >
                        <v-icon small>mdi-lock</v-icon>
                      </v-btn>
                    </template>

                    <template v-slot:contextItem="{ item }">
                      <v-list-item
                        justify="center"
                        v-if="showUserStatusBtn(item)"
                        @click="openStatusModal(item)"
                      >
                        <v-list-item-icon>
                          <v-icon dense>mdi-account-badge-outline</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                          {{ $t("user_status_change") }}
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item
                        justify="center"
                        v-if="showUserRoleBtn(item)"
                        @click="openRoleModal(item)"
                      >
                        <v-list-item-icon>
                          <v-icon dense>mdi-shield-account</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                          {{ $t("user_role_change") }}
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item
                        justify="center"
                        v-if="showUserPasswordBtn(item)"
                        @click="openPasswordModal(item)"
                      >
                        <v-list-item-icon>
                          <v-icon dense>mdi-lock-outline</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                          {{ $t("setting_password") }}
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </data-table>
                </div>

                <!-- 사용자 상태 변경 -->
                <Dialog :title="$t('user_status_change')" ref="statusDialog" max-width="200"
                  :clickYesBtn="$t('save')"
                  @click-yes="updateUserStatus(selectedUser)"
                >
                  <template v-slot:content>
                    <data-select 
                        v-if="selectedUser"
                        :items="Object.values(userStatusOptions)"
                        v-model="selectedStatus"
                        @keyup.enter="updateUserStatus(selectedUser)"
                      >
                      
                      </data-select>
                  </template>
                </Dialog>
                

                <!-- 사용자 등급 변경 -->

                <Dialog :title="$t('user_role_change')" ref="userRoleDialog" max-width="200"
                  :clickYesBtn="$t('save')"
                  @click-yes="updateUserRole(selectedUser)"
                >
                  <template v-slot:content>
                    <data-select 
                        v-if="selectedUser"
                        :items="Object.values(userRoleOptions)"
                        v-model="selectedRole"
                        @keyup.enter="updateUserRole(selectedUser)"
                      >
                      
                      </data-select>
                  </template>
                </Dialog>


                <!-- 관리자 권한으로 비밀번호 변경 -->
                <v-dialog
                  v-model="passwordModalOpen"
                  max-width="450"
                  class="my-auto"
                >
                  <v-card>
                    <v-card-title class="mb-4">
                      <strong>{{ $t("setting_password") }}</strong>
                    </v-card-title>

                    <v-card-text>
                      <v-row no-gutters>
                        <v-col cols="12">
                          <v-text-field
                            id="changePasswordInput3"
                            full-width
                            type="password"
                            autocomplete="new-password"
                            prepend-inner-icon="mdi-lock-outline"
                            :label="$t('login_password')"
                            :append-icon="
                              changePassword.length >= 4 ? 'mdi-check' : ''
                            "
                            v-bind="addUserAttrs"
                            v-model="changePassword"
                            solo
                            :maxlength="20"
                          />
                        </v-col>

                        <v-col cols="12">
                          <v-text-field
                            id="changePasswordInput4"
                            type="password"
                            prepend-inner-icon="mdi-lock-outline"
                            full-width
                            :label="$t('login_password_check')"
                            :append-icon="
                              changePasswordConfirm === changePassword &&
                              changePassword.length >= 4
                                ? 'mdi-check'
                                : ''
                            "
                            v-bind="addUserAttrs"
                            v-model="changePasswordConfirm"
                            solo
                            :maxlength="20"
                            @keyup.enter="changePasswordByAdmin(selectedUser)"
                          />
                        </v-col>
                      </v-row>
                    </v-card-text>

                    <v-card-actions class="mb-1">
                      <v-spacer />
                      <v-btn text @click="passwordModalOpen = false">{{
                        $t("close")
                      }}</v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="changePasswordByAdmin(selectedUser)"
                        >{{ $t("save") }}</v-btn
                      >
                   
                    </v-card-actions>
                  </v-card>
                </v-dialog>

                <!-- 사용자 추가 -->
                <v-dialog
                  v-model="addModalOpen"
                  max-width="450"
                  class="my-auto"
                >
                  <v-card>
                    <v-card-title class="mb-4">
                      <strong>{{ $t("add_user") }}</strong>
                    </v-card-title>

                    <v-card-text>
                      <v-row no-gutters>
                        <v-col cols="12">
                          <v-row no-gutters>
                            <v-col cols="6">
                              <data-input
                                id="addUserInput2"
                                ref="addUser"
                                :title="$t('login_id')"
                                :append-icon="
                                  $regular.emailPatten(addUserEmailFront) &&
                                  addUserEmailFront.length > 0
                                    ? 'mdi-check'
                                    : ''
                                "
                                v-bind="addUserAttrs"
                                v-model="addUserEmailFront"
                                :rules="rulesOn ? [rules.emailRequired] : []"
                                :maxlength="50"
                                @input="
                                  () => {
                                    rulesOn = false;
                                  }
                                "
                                :autofocus="true"
                                class="mr-1"
                              />
                            </v-col>
                            <v-col cols="6">
                              <data-input
                                id="addUserInput2"
                                ref="addUser"
                                :title="$t('email_address')"
                                :append-icon="
                                  $regular.emailPatten(addUserEmailBack) &&
                                  addUserEmailBack.length > 0
                                    ? 'mdi-check'
                                    : ''
                                "
                                v-bind="addUserAttrs"
                                v-model="addUserEmailBack"
                                :rules="rulesOn ? [rules.emailRequired] : []"
                                :maxlength="50"
                                @input="
                                  () => {
                                    rulesOn = false;
                                  }
                                "
                              >
                                <template v-slot:prepend-inner> @ </template>
                              </data-input>
                            </v-col>
                          </v-row>
                        </v-col>

                        <v-col cols="12">
                          <data-select
                            ref="addUser"
                            :items="[
                              $t('email_active_input'),
                              'naver.com',
                              'gmail.com',
                              'daum.net',
                              'nate.com',
                              'hanmail.net',
                            ]"
                            @change="
                              (e) =>
                                e === $t('email_active_input')
                                  ? (addUserEmailBack = '')
                                  : (addUserEmailBack = e)
                            "
                            :title="$t('email_address')"
                          >
                          </data-select>
                        </v-col>

                        <v-col cols="12">
                          <data-input
                            id="addUserInput1"
                            ref="addUser"
                            :title="$t('nickname')"
                            :append-icon="
                              $regular.name(addUserNickname) ? 'mdi-check' : ''
                            "
                            v-bind="addUserAttrs"
                            v-model="addUserNickname"
                            :rules="rulesOn ? [rules.name] : []"
                            :maxlength="50"
                            @input="
                              () => {
                                rulesOn = false;
                              }
                            "
                            @keyup.enter="addUser"
                          />
                        </v-col>
                      </v-row>
                    </v-card-text>

                    <v-card-actions class="mb-1">
                      <v-spacer />
                      <v-btn text @click="addModalOpen = false">{{
                        $t("close")
                      }}</v-btn>
                      <v-btn  color="primary" @click="addUser">{{
                        $t("add")
                      }}</v-btn>
                
                    </v-card-actions>
                  </v-card>
                </v-dialog>

                <!-- 시스템 로그 -->
                <div
                  v-if="selectedSetting?.id === 'system_log'"
                  class="ma-0 pa-0"
                >
                  <data-table
                    :headers="[
                      {
                        text: $t('USER'),
                        value: 'userEmail',
                      },
                      {
                        text: $t('message'),
                        value: 'message',
                      },
                      {
                        text: $t('type'),
                        value: 'eventType',
                      },
                      {
                        text: $t('date'),
                        align: 'start',
                        sortable: true,
                        value: 'creationTime',
                      },
                    ]"
                    :items="filterSystemLog"
                    :items-per-page="10"
                    class="elevation-1"
                    disable-sort
                    dense
                  >
                    <template v-slot:item.userEmail="{ item }">
                      <div class="d-flex align-center">
                        <profile-avatar
                          :size="26"
                          :emailLoad="item.userEmail"
                          :show-name="true"
                          :show-tooltip="true"
                          style="
                            margin-top: 4px;
                            margin-bottom: 4px;
                            margin-right: 0;
                          "
                        ></profile-avatar>
                      </div>
                    </template>
                  </data-table>
                </div>

                <!-- 시스템 정보-->
                <div v-else-if="selectedSetting?.id === 'system_info'">
                  <v-list dense color="transparent">
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ $t("system_status_version") }}
                        </v-list-item-title>
                      </v-list-item-content>

                      <v-list-item-action>
                        {{ systemStatus.version }}
                      </v-list-item-action>
                    </v-list-item>

                    <v-divider />
                  </v-list>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </Dialog>
  </div>
</template>

<script>
import Dialog from "./Dialog.vue";
import PushSetting from "../settings/PushSetting.vue";
const packageJson = require("~/package.json");

const ROLE = {
  USER: "USER",
  ADMIN: "ADMIN",
  MASTER: "MASTER",
};

const STATUS = {
  UNVERIFIED: "UNVERIFIED",
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  BLOCK: "BLOCK",
  DORMANT: "DORMANT",
  DELETE: "DELETE",
};

export default {
  components: {
    Dialog,
    PushSetting,
  },
  props: {
    dialogActive: Boolean,
  },
  data() {
    return {
      dialog: false,
      user: null,
      selectedSettings: [],
      selectedSetting: null,
      settings: [],
      settingKey: 0,
      settingIndex: {},
      keyword: "",
      searchedList: [],
      history: [],
      profileName: "",
      profileImage: "",
      profileModalOpen: false,
      selectedImage: null,
      currentPassword: "",
      currentPasswordCheck: false,
      newPassword: "",
      confirmNewPassword: "",
      deleteModalOpen: false,
      deleteEmail: "",
      deletePassword: "",
      passwordModalOpen: false,
      selectedUser: null,
      changePassword: "",
      changePasswordConfirm: "",
      addModalOpen: false,
      addUserEmailFront: "",
      addUserEmailBack: "",
      addUserNickname: "",
      addUserAttrs: {
        rounded: false,
        required: true,
        dense: true,
      },
      member: [],
      memberData: {},
      userStatusOptions: {},
      selectedStatus: "",
      userRoleOptions: {},
      selectedRole: "",
      roleComboboxOpen: false,
      systemLog: [],
      filterSystemLog: [],
      rulesOn: false,
      rules: {
        emailRequired: (value) => !!value || this.$t("rules_email"),
        passwordRequired: (value) => !!value || this.$t("rules_password"),
        email: (value) => {
          return (
            this.$regular.emailPatten(value) || this.$t("rules_correct_email")
          );
        },
        password: (value) => {
          return (
            this.$regular.passwordPatten(value) ||
            this.$t("rules_password_pattern")
          );
        },
        passwordOk1: (value) => {
          return (
            value === this.newPassword || this.$t("rules_password_not_match")
          );
        },
        passwordOk2: (value) => {
          return (
            value === this.changePassword || this.$t("rules_password_not_match")
          );
        },
        name: (value) => {
          return this.$regular.name(value) || this.$t("rules_nickname");
        },
        number: (value) => {
          return this.$regular.number(value) || this.$t("rules_number");
        },
      },

      configurations: [],

      systemStatus: {
        version: packageJson.version,
      },
    };
  },
  computed: {
    showSaveBtn() {
      if (this.selectedSetting) {
        let hasInputType = false;
        if (
          this.selectedSetting.id === "profile" ||
          this.selectedSetting.id === "security"
        ) {
          hasInputType = true;
        } else {
          hasInputType = false;
        }
        return hasInputType;
      }
    },
    imageURL() {
      return this.selectedImage
        ? URL.createObjectURL(this.selectedImage)
        : this.profileImage;
    },
    addUserEmail() {
      return this.addUserEmailFront + "@" + this.addUserEmailBack;
    },
    showUserStatusBtn() {
      return (item) => {
        if (
          (this.user?.role === ROLE.ADMIN &&
            (item?.role === ROLE.ADMIN || item?.role === ROLE.MASTER)) ||
          item?.role === ROLE.MASTER ||
          item?.status === STATUS.UNVERIFIED
        ) {
          return false;
        }
        return true;
      };
    },
    showUserRoleBtn() {
      return (item) => {
        if (
          (this.user?.role === ROLE.ADMIN && item?.role === ROLE.ADMIN) ||
          item?.role === ROLE.MASTER
        ) {
          return false;
        }
        return true;
      };
    },
    showUserPasswordBtn() {
      return (item) => {
        if (
          this.user?.role === ROLE.MASTER ||
          this.user?.email === item.email ||
          (this.user?.role === ROLE.ADMIN && item.role === ROLE.USER)
        ) {
          return true;
        }
        return false;
      };
    },
  },

  methods: {
    init() {
      this.$nextTick(() => {
        const commonSettings = [
          {
            id: "general",
            name: this.$t("setting_general"),
            description: this.$t("setting_general_description"),
            type: "root",
            children: [
              // {
              //   id: "theme",
              //   name: this.$t("setting_theme"),
              //   description: this.$t("setting_theme_description"),
              //   settingItems: [
              //     {
              //       name: "theme",
              //       type: "select",
              //       items: ["light", "dark", "system"],
              //       model: this.$store.state.theme,
              //       input: this.setTheme,
              //     },
              //   ],
              // },
              {
                id: "localization",
                name: this.$t("setting_localization"),
                description: this.$t("setting_localization_description"),
                settingItems: [
                  {
                    name: "localization",
                    type: "select",
                    items: ["ko", "en"],
                    model: this.$store.state.locale,
                    input: this.setLocale,
                  },
                ],
              },
            ],
          },
          {
            id: "integration",
            name: this.$t("setting_integration"),
            description: this.$t("setting_integration_description"),
            type: "root",
            children: [
              {
                id: "integration_notification",
                name: this.$t("setting_integration_notification"),
                description: this.$t(
                  "setting_integration_notification_description"
                ),
                settingItems: [
                  {
                    name: "push",
                    type: "push",
                    items: ["ko", "en"],
                    input: this.setLocale,
                    custom: true,
                  },
                ],
              },
            ],
          },
          {
            id: "account",
            name: this.$t("setting_account"),
            description: this.$t("setting_account_description"),
            type: "root",
            children: [
              {
                id: "profile",
                name: this.$t("setting_profile"),
                description: this.$t("setting_profile_description"),
              },
              {
                id: "security",
                name: this.$t("setting_security"),
                description: this.$t("setting_security_description"),
              },
              {
                id: "history",
                name: this.$t("setting_history"),
              },
              {
                id: "delete_account",
                name: this.$t("setting_delete_account"),
              },
            ],
          },
        ];
        const adminSettings = [
          {
            id: "admin",
            name: this.$t("setting_admin"),
            description: this.$t("setting_admin_description"),
            type: "root",
            children: [
              {
                id: "user_management",
                name: this.$t("setting_user_management"),
                description: this.$t("setting_user_management_description"),
              },
              {
                id: "system_log",
                name: this.$t("setting_system_log"),
                description: this.$t("setting_system_log_description"),
              },
              {
                id: "system_info",
                name: this.$t("setting_system_info"),
                description: this.$t("setting_system_info_description"),
              },
              {
                id: "developer_mode",
                name: this.$t("setting_developer_mode"),
                description: this.$t("setting_developer_mode_description"),
                settingItems: [
                  {
                    name: "developer_mode",
                    type: "select",
                    items: ["disabled", "active"],
                    model: this.$store.state.developerMode,
                    input: (val) => {
                      this.$store.state.developerMode = val;
                    },
                  },
                ],
              },
            ],
          },
        ];
        if (this.user && this.user.role !== ROLE.USER) {
          this.settings = [...commonSettings, ...adminSettings];
          this.getMember();
        } else {
          this.settings = commonSettings;
        }
        this.generateSettingIndex(this.settings);
        this.settingKey++;
      });
    },

    generateSettingIndex(settings) {
      this.settingIndex = {};
      for (let i = 0; i < settings.length; i++) {
        for (let j = 0; j < settings[i].children.length; j++) {
          let settingMenu = settings[i].children[j];
          this.settingIndex[settingMenu.name] = settingMenu;
        }
      }
    },

    onEnterSearch() {
      if (this.searchedList.length > 0) {
        this.onClickItem(null, this.searchedList[0]);
        this.keyword = "";
      }
    },

    onClickItem(e, item) {
      this.selectedSettings = [item.id];
      this.selectedSetting = item;
      if (item.id === "profile") {
        this.profileName = this.user.name;
        this.getProfileImage();
      }
      if (item.id === "history") {
        this.userHistory();
      }
      if (item.id === "system_log") {
        this.getSystemLog();
      }
    },

    setTheme(theme) {
      this.$systemUtils.setTheme(this.$vuetify, this.$store, theme);
    },

    setLocale(locale) {
      this.$systemUtils.setLocale(this.$i18n, this.$store, locale);
      this.init();
    },

    activeDialog() {
      this.init();
      this.$refs.settingDialog.dialog = true;
    },

    userHistory() {
      if (this.user._id) {
        const id = this.user._id;
        const isKorean = this.$i18n.locale === "ko";
        this.$axios
          .get("/auth/user/history/" + id)
          .then((res) => {
            this.history = res.data.history.map((item) => ({
              ...item,
              creationTime: this.convertTimeFormat(new Date(item.creationTime)),
              eventType: this.$t(item.eventType),
              message: isKorean ? item.messageKo : item.messageEn,
            }));
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },

    convertTimeFormat(time) {
      return new Date(time).toLocaleTimeString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    },

    setProfileName() {
      const name = this.profileName;
      this.rulesOn = true;
      if (name.length < 1) {
        document.getElementById("nameInput").focus();
        return;
      } else if (!this.$regular.name(name)) {
        this.$snotify.error(this.$t("rules_nickname"));
        document.getElementById("nameInput").focus();
        return;
      }
      let data = {
        email: this.user.email,
        newName: name,
      };
      this.$axios
        .patch("/auth/user/change/name", data)
        .then((res) => {
          this.user.name = name;
          this.$snotify.success(this.$t("name_change_complete"));
          this.$emit("userChanged");
        })
        .catch((err) => {
          this.$snotify.error(this.$t("error_default"));
        });
    },

    openProfileModal() {
      this.profileModalOpen = true;
    },

    setSelectedImage(event) {
      this.selectedImage = event.target.files[0];
    },

    async setProfileImage() {
      const formData = new FormData();
      if (this.selectedImage) {
        const file = this.selectedImage;
        formData.append("file", file);
        const email = this.user.email;
        await this.$axios
          .post("/auth/user/change/profileImage/" + email, formData)
          .then((res) => {
            this.user.profileImage = res.data.key;
            this.getProfileImage();
            this.$emit("userChanged");
            this.$snotify.success(this.$t("profile_image_change_complete"));
          })
          .catch((err) => {
            console.log(err);
          });
      }
      this.profileModalOpen = false;
    },

    getProfileImage() {
      if (this.user.profileImage) {
        const image =
          this.$axios.defaults.baseURL +
          "/auth/user/profileImage/" +
          this.user.profileImage;
        this.profileImage = image;
      }
    },

    async setPassword() {
      this.rulesOn = true;
      if (
        !this.currentPassword ||
        !this.newPassword ||
        !this.confirmNewPassword
      ) {
        this.$snotify.error(this.$t("rules_password"));
        document.getElementById("passwordInput1").focus();
        return;
      } else if (!this.currentPasswordCheck) {
        this.$snotify.error(this.$t("rules_current_password_not_match"));
        document.getElementById("passwordInput1").focus();
        return;
      } else if (!this.$regular.passwordPatten(this.newPassword)) {
        this.$snotify.error(this.$t("rules_password_pattern"));
        document.getElementById("passwordInput2").focus();
        return;
      } else if (this.newPassword != this.confirmNewPassword) {
        this.$snotify.error(this.$t("rules_password_not_match"));
        document.getElementById("passwordInput3").focus();
        return;
      }

      const passwordData = {
        email: this.user.email,
        password: this.currentPassword,
        newPassword: this.newPassword,
      };

      const check = await this.checkCurrentPassword;
      if (!check) {
        this.$snotify.error(this.$t("rules_current_password_not_match"));
        return;
      }

      await this.$axios
        .post("/auth/password/reset", passwordData)
        .then((res) => {
          this.$snotify.success(this.$t("password_change_complete"));
        })
        .catch((err) => {
          console.log(err);
          this.$snotify.error(this.$t("error_default"));
          return;
        })
        .finally(() => {
          this.currentPassword = "";
          this.newPassword = "";
          this.confirmNewPassword = "";
          this.currentPasswordCheck = false;
        });
    },

    checkCurrentPassword() {
      const passwordData = {
        email: this.user.email,
        password: this.currentPassword,
      };
      this.$axios
        .post("/auth/password/check", passwordData)
        .then((res) => {
          this.currentPasswordCheck = true;
        })
        .catch((err) => {
          console.log(err);
          this.currentPasswordCheck = false;
        });
    },

    openDeleteModal() {
      this.deleteModalOpen = true;
    },

    async deleteAccount() {
      const accountData = {
        password: this.deletePassword,
      };
      const token = this.$auth.$storage.getUniversal("_token.local");
      await this.$axios
        .patch("/auth/delete", accountData, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          this.$snotify.success(this.$t("delete_account_complete"));
          this.deleteModalOpen = false;
          this.$auth.logout();
          setTimeout(() => {
            this.$router.push("/auth/login");
          }, 500);
        })
        .catch((err) => {
          console.log(err);
          this.$snotify.error(this.$t("error_default"));
          return;
        });
    },

    saveInput() {
      if (this.selectedSetting.id === "profile") {
        this.setProfileName();
      }
      if (this.selectedSetting.id === "security") {
        this.setPassword();
      }
    },

    openAddModal() {
      this.addUserEmailFront = "";
      this.addUserEmailBack = "";
      this.addUserNickname = "";
      this.addModalOpen = true;
    },

    openPasswordModal(selectedUser) {
      this.selectedUser = selectedUser;
      if (this.user.role === ROLE.MASTER) {
        this.passwordModalOpen = true;
      } else if (this.user.email === this.selectedUser.email) {
        this.passwordModalOpen = true;
      } else if (
        this.user.role === ROLE.ADMIN &&
        this.selectedUser.role === ROLE.USER
      ) {
        this.passwordModalOpen = true;
      } else {
        this.passwordModalOpen = false;
      }
    },

    getUserPasswordClass(item) {
      if (this.user.role === ROLE.MASTER) {
        return "ml-3 hover-class-default";
      } else if (this.user.email === item.email) {
        return "ml-3 hover-class-default";
      } else if (this.user.role === ROLE.ADMIN && item.role === ROLE.USER) {
        return "ml-3 hover-class-default";
      } else {
        return "ml-3 hover-class-hide";
      }
    },

    async changePasswordByAdmin() {
      if (this.changePassword !== this.changePasswordConfirm) {
        this.changePasswordConfirm = "";
        document.getElementById("changePasswordInput3").focus();
        return;
      }
      const token = this.$auth.$storage.getUniversal("_token.local");
      const passwordData = {
        email: this.selectedUser.email,
        password: this.changePassword,
      };

      await this.$axios
        .patch("/auth/admin/member/password", passwordData, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          this.$snotify.success(this.$t("password_change_complete"));
          this.passwordModalOpen = false;
          this.selectedUser = null;
        })
        .catch((err) => {
          console.error(err);
        });
    },

    async getMember() {
      const token = this.$auth.$storage.getUniversal("_token.local");
      await this.$axios
        .get("/auth/admin/member", {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          this.member = res.data.member.map((item) => ({
            ...item,
            signupDate: item?.signupDate ? this.convertTimeFormat(new Date(item.signupDate)) : '',
            selectedRole: this.$t(item.role),
            selectedStatus: this.$t(item.status),
          }));
          res.data.userRole.forEach((item) => {
            if (item !== ROLE.MASTER) {
              this.userRoleOptions[item] = this.$t(item);
            }
          });
          res.data.userStatus.forEach((item) => {
            if (item === STATUS.ACTIVE || item === STATUS.BLOCK) {
              this.userStatusOptions[item] = this.$t(item);
            }
          });
          (this.memberData["all"] = this.$t("view_all")),
            this.member.forEach((item) => {
              this.memberData[item.email] = item.name;
            });
        })
        .catch((err) => {
          console.error(err);
        });
    },

    async checkEmailDuplicated() {
      if (!this.$regular.emailPatten(this.addUserEmail)) {
        this.$snotify.error(this.$t("rules_correct_email"));
        return false;
      }
      if (this.addUserEmail === "") {
        this.$snotify.error(this.$t("rules_email"));
        return false;
      }
      let result = false;
      await this.$axios
        .get("/auth/email-validation/" + this.addUserEmail)
        .then((res) => {
          result = res.data.body === "OK";
        })
        .catch((err) => {
          console.log(err);
        });

      if (result) {
        return true;
      } else {
        this.$snotify.error(this.$t("already_exist_email"));
        this.addUserEmail = "";
        return false;
      }
    },

    async addUser() {
      this.rulesOn = true;
      if (this.addUserNickname.length < 1) {
        document.getElementById("addUserInput1").focus();
        return;
      } else if (!this.$regular.name(this.addUserNickname)) {
        document.getElementById("addUserInput1").focus();
        return;
      } else if (
        this.addUserEmail.length < 1 ||
        !this.$regular.emailPatten(this.addUserEmail)
      ) {
        document.getElementById("addUserInput2").focus();
        return;
      }
      let emailDuplicated = await this.checkEmailDuplicated();
      if (!emailDuplicated) {
        return;
      }

      const token = this.$auth.$storage.getUniversal("_token.local");
      const newUser = {
        email: this.addUserEmail,
        name: this.addUserNickname,
        baseUrl: this.$config.host
      };

      await this.$axios
        .post("/auth/admin/member/add", newUser, {
          headers: {
            Authorization: token,
          }
        })
        .then((res) => {
          this.$snotify.success(this.$t("add_user_complete_message"));
          this.addModalOpen = false;
          this.getMember();
        })
        .catch((err) => {
          console.error(err);
        });
    },

    getUserStatusClass(item) {
      if (
        this.user.role === ROLE.ADMIN &&
        (item.role === ROLE.ADMIN || item.role === ROLE.MASTER)
      ) {
        return "hover-class-hide";
      } else if (item.role === ROLE.MASTER) {
        return "hover-class-hide";
      } else {
        return "hover-class-default";
      }
    },

    openStatusModal(selectedUser) {
      this.selectedUser = selectedUser;
      this.selectedStatus = selectedUser.selectedStatus;
      if (
        this.user.role === ROLE.ADMIN &&
        (this.selectedUser.role === ROLE.ADMIN ||
          this.selectedUser.role === ROLE.MASTER)
      ) {
        this.$refs.statusDialog.dialog = false
        return;
      } else if (this.selectedUser.role === ROLE.MASTER) {
        this.$refs.statusDialog.dialog = false
        return;
      } else {
        this.$refs.statusDialog.dialog = true
      }
    },

    updateUserStatus(item) {
      let userStatus;
      for (const [key, value] of Object.entries(this.userStatusOptions)) {
        if (value === this.selectedStatus) {
          userStatus = key;
        }
      }
      const data = {
        email: item.email,
        status: userStatus,
      };
      const token = this.$auth.$storage.getUniversal("_token.local");
      this.$axios
        .patch("/auth/admin/member/status", data, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          const changeMember = this.member.find(
            (member) => member.email === item.email
          );
          if (changeMember) {
            changeMember.status = userStatus;
            changeMember.selectedStatus = this.$t(userStatus);
          }
          this.$refs.statusDialog.dialog = false
          this.$snotify.success(this.$t("user_status_change_complete"));
        })
        .catch((err) => {
          console.error(err);
        });
    },

    getUserRoleClass(item) {
      if (this.user.role === ROLE.ADMIN && item.role === ROLE.ADMIN) {
        return "hover-class-hide";
      } else if (item.role === ROLE.MASTER) {
        return "hover-class-hide";
      } else {
        return "hover-class-default";
      }
    },

    openRoleModal(selectedUser) {
      this.selectedUser = selectedUser;
      this.selectedRole = selectedUser.selectedRole;
      if (
        this.user.role === ROLE.ADMIN &&
        this.selectedUser.role === ROLE.ADMIN
      ) {
        this.$refs.userRoleDialog.dialog = false
        return;
      } else if (this.selectedUser.role === ROLE.MASTER) {
        this.$refs.userRoleDialog.dialog = false
        return;
      } else {
        this.$refs.userRoleDialog.dialog = true
      }
    },

    updateUserRole(item) {
      let userRole;
      for (const [key, value] of Object.entries(this.userRoleOptions)) {
        if (value === this.selectedRole) {
          userRole = key;
        }
      }
      const data = {
        email: item.email,
        role: userRole,
      };
      const token = this.$auth.$storage.getUniversal("_token.local");
      this.$axios
        .patch("/auth/admin/member/role", data, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          const changeMember = this.member.find(
            (member) => member.email === item.email
          );
          if (changeMember) {
            changeMember.role = userRole;
            changeMember.selectedRole = this.$t(userRole);
          }
          this.$refs.userRoleDialog.dialog = false
          this.$snotify.success(this.$t("user_role_change_complete"));
        })
        .catch((err) => {
          console.error(err);
        });
    },

    getSystemLog() {
      const token = this.$auth.$storage.getUniversal("_token.local");
      const isKorean = this.$i18n.locale === "ko";
      this.$axios
        .get("/auth/admin/systemLog", {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          this.systemLog = res.data.systemLog.map((item) => ({
            ...item,
            creationTime: this.convertTimeFormat(new Date(item.creationTime)),
            eventType: this.$t(item.eventType),
            message: isKorean ? item.messageKo : item.messageEn,
          }));
          this.filterSystemLog = this.systemLog;
        })
        .catch((err) => {
          console.error(err);
        });
    },

    showMemberHistory(item) {
      if (!item) {
        this.filterSystemLog = this.systemLog;
        return;
      }

      let email;
      for (const [key, value] of Object.entries(this.memberData)) {
        if (value === item) {
          email = key;
        }
      }
      if (email.length > 0 && email !== "all") {
        this.filterSystemLog = this.systemLog.filter(
          (item) => item.userEmail === email
        );
      } else {
        this.filterSystemLog = this.systemLog;
      }
    },
  },

  mounted() {
    if (this.$auth.user) {
      this.user = this.$auth.user;
    } else {
      this.$router.push("/auth/login");
    }
    this.init();
  },

  watch: {
    dialog() {
      if (this.dialog) {
        this.init();
      }
    },
    keyword() {
      this.searchedList = [];
      if (this.keyword) {
        for (let key of Object.keys(this.settingIndex)) {
          if (key.toLowerCase().includes(this.keyword.toLowerCase())) {
            this.searchedList.push(this.settingIndex[key]);
          }
        }
      }
    },
  },
};
</script>

<style lang="scss">
.hover-class-hide:hover {
  cursor: default;
}
.hover-class-hide::before {
  cursor: default;
  transition: none !important;
  background-color: inherit !important;
  box-shadow: none !important;
  color: inherit !important;
}
.hover-class-hide::after {
  cursor: default;
  transition: none !important;
  background-color: inherit !important;
  box-shadow: none !important;
  color: inherit !important;
}
.v-application--is-ltr .v-text-field .v-input__prepend-inner {
  margin: auto !important;
}
</style>
