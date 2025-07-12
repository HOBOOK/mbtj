<template>
    <label class="data-switch">
        <input type="checkbox" :checked="modelValue" @change="toggleSwitch" />
        <span class="slider">
        </span>
    </label>

</template>

<script>
export default {
    name: 'DataSwitch',
    props: {
        modelValue: Boolean,
    },
    computed: {
        checked: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit("update:modelValue", value);
            },
        },
    },
    methods: {
        toggleSwitch(event) {
            const newValue = event.target.checked
            this.$emit("update:modelValue", newValue);
            this.$emit("change", newValue)
        },
    }
};
</script>

<style lang="scss">
.data-switch {
    position: relative;
    display: inline-block;
    width: 36px;
    height: 24px;

    input {
        opacity: 0;
        width: 0;
        height: 0;

        &:checked+.slider {
            // background: linear-gradient(150deg, #3EB8FFf0, #3E98F5a0, #3E98F530) !important;

            &::before {
                transform: translateX(12px);
                background: #fff;
                background: linear-gradient(150deg, #3EB8FFf0, #3E98F5a0, #3E98F530) !important;
            }
        }
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #cccccc40;
        transition: 0.15s;
        border-radius: 0.5rem;

        &:hover{
            background-color: #cccccc70;

            &::before {
            }
        }

        &::before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: $dark-primary-deep-background-color;
            transition: 0.4s;
            border-radius: 0.3rem;
        }
    }
}
</style>