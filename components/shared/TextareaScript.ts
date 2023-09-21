import _ from 'lodash';
import { targetedEventHandler } from './utils';

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

    const input = ref(props.modelValue);

    const textarea = ref<HTMLTextAreaElement>();
    const height = ref(props.minHeight);

    // const handleInput = targetedEventHandler(HTMLTextAreaElement, ({ target }) => {
    //   height.value = props.minHeight; // reset the height, otherwise it won’t shrink
    //   nextTick(() => height.value = target.scrollHeight); // recalculate the height
    //   emit('update:modelValue', target.value);
    // })

    watch(input, value => {
      emit('update:modelValue', value)
      const input = textarea.value;
      if (input) {
        height.value = props.minHeight; // reset the height, otherwise it won’t shrink
        nextTick(() => height.value = input.scrollHeight); // recalculate the height
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