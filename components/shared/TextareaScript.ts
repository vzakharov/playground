import _ from 'lodash';
import { targetedEventHandler } from './utils';
import { useModelWrapper } from '~/composables/useModelWrapper';
import { $throw } from 'vovas-utils';
import { uniqueId } from '~/lib/utils';

function addNewline(input: HTMLTextAreaElement) {
  const { selectionStart, selectionEnd, value } = input;
  const newValue = `${value.slice(0, selectionStart)}\n${value.slice(selectionEnd)}`;
  input.value = newValue;
  input.selectionStart = input.selectionEnd = selectionStart + 1;
};

export const Textarea = defineComponent({

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
    },
    label: {
      type: [ String, Boolean ] as PropType<string | false>
    }
  },

  emits: {
    'update:modelValue': (value: string) => true,
    submit: (value: string) => true
  },

  setup(props, { emit }) {

    const input = useModelWrapper(props, emit);
    const id = uniqueId('textarea')

    const textarea = ref<HTMLTextAreaElement>();
    const height = ref(props.minHeight);

    watch(input, () => {
      const inputElement = textarea.value;
      if (inputElement) {
        height.value = props.minHeight; // reset the height, otherwise it won’t shrink
        nextTick(() => height.value = inputElement.scrollHeight); // recalculate the height
      }
    });

    function handleKeydown(key: 'enter' | 'shift+enter') {
      if (key === 'enter' === props.submitOnEnter) {
        emit('submit', input.value);
      } else {
        addNewline(textarea.value ?? $throw('Textarea element not found'));
      }
    }

    const { mapValues } = _;

    return {
      textarea,
      handleKeydown,
      id,
      input,
      mapValues,
      height
    };
    
  }

});

export default Textarea;