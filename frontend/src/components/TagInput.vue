<!-- frontend/src/components/TagInput.vue -->
<template>
  <div class="relative">
    <div
      class="min-h-[42px] w-full p-2 border border-gray-300 rounded-lg flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-gray-200"
      @click="focusInput"
    >
      <span
        v-for="tag in modelValue"
        :key="tag"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
      >
        {{ tag }}
        <button
          type="button"
          class="ml-1 inline-flex items-center p-0.5 hover:bg-gray-200 rounded-full"
          @click.stop="removeTag(tag)"
        >
          <span class="sr-only">Remove tag</span>
          <i class="fi fi-rr-cross-small text-gray-500"></i>
        </button>
      </span>
      
      <input
        ref="inputRef"
        v-model="inputValue"
        type="text"
        class="flex-1 outline-none min-w-[60px] bg-transparent"
        :placeholder="placeholder"
        @keydown.enter.prevent="addTag"
        @keydown.backspace="handleBackspace"
        @keydown.delete="handleBackspace"
        @keydown.tab="addTag"
        @keydown.188="addTag"
        @blur="handleBlur"
      />
    </div>
    
    <p v-if="maxTags" class="mt-1 text-sm text-gray-500 text-right">
      {{ modelValue.length }}/{{ maxTags }} tags
    </p>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Add tags...'
  },
  maxTags: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['update:modelValue']);

const inputRef = ref(null);
const inputValue = ref('');

const focusInput = () => {
  inputRef.value?.focus();
};

const addTag = (event) => {
  event.preventDefault();
  const value = inputValue.value.trim();
  
  if (!value) return;
  
  if (props.maxTags && props.modelValue.length >= props.maxTags) {
    return;
  }
  
  if (!props.modelValue.includes(value)) {
    emit('update:modelValue', [...props.modelValue, value]);
  }
  
  inputValue.value = '';
};

const removeTag = (tagToRemove) => {
  emit(
    'update:modelValue',
    props.modelValue.filter(tag => tag !== tagToRemove)
  );
};

const handleBackspace = (event) => {
  if (!inputValue.value && props.modelValue.length > 0) {
    event.preventDefault();
    removeTag(props.modelValue[props.modelValue.length - 1]);
  }
};

const handleBlur = () => {
  if (inputValue.value) {
    addTag({ preventDefault: () => {} });
  }
};
</script>