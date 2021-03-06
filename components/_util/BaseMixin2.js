import { getOptionProps } from './props-util';

export default {
  methods: {
    setState(state = {}, callback) {
      let newState = typeof state === 'function' ? state(this, this.$props) : state;
      if (this.getDerivedStateFromProps) {
        const s = this.getDerivedStateFromProps(getOptionProps(this), {
          ...this,
          ...newState,
        });
        if (s === null) {
          return;
        } else {
          newState = { ...newState, ...(s || {}) };
        }
      }
      Object.assign(this, newState);
      if (this._.isMounted) {
        this.$forceUpdate();
      }
      this.$nextTick(() => {
        callback && callback();
      });
    },
    __emit() {
      // 直接调用事件，底层组件不需要vueTool记录events
      const args = [].slice.call(arguments, 0);
      let eventName = args[0];
      eventName = `on${eventName[0].toUpperCase()}${eventName.substring(1)}`;
      const event = this.$props[eventName] || this.$attrs[eventName];
      if (args.length && event) {
        if (Array.isArray(event)) {
          for (let i = 0, l = event.length; i < l; i++) {
            event[i](...args.slice(1));
          }
        } else {
          event(...args.slice(1));
        }
      }
    },
  },
};
