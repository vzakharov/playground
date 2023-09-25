import _ from 'lodash';
import { targetedEventHandler } from './utils';
import { useModelWrapper } from '~/composables/useModelWrapper';

export default defineComponent({

  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: String,
    submitOnEnter: {
      type: Boolean,
      default: false
    },
    minHeight: {
      type: Number,
      default: 50
    },
    maxHeight: {
      type: Number,
      default: 200
    }
  },

  emits: {
    'update:modelValue': (value: string) => true,
    submit: (value: string) => true
  },

  setup(props, { emit }) {

    const input = useModelWrapper(props, emit);

    const textarea = ref<HTMLTextAreaElement>();
    const height = ref(props.minHeight);

    watch(input, () => {
      const inputElement = textarea.value;
      if (inputElement) {
        height.value = props.minHeight; // reset the height, otherwise it won’t shrink
        nextTick(() => height.value = inputElement.scrollHeight); // recalculate the height
      }
    });

    const handleKeydown = (key: 'enter' | 'shift+enter') => {
      if (key === 'enter' === props.submitOnEnter) {
        emit('submit', input.value);
      } else {
        input.value += '\n';
      }
    }

    const { mapValues } = _;

    return {
      textarea,
      handleKeydown,
      input,
      mapValues,
      height
    };
    
  }

});