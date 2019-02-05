export default {
  methods: {
    hasPermissionsInGroup(group, prefix) {
      for (const item of group.settings) {
        if (this.$can(prefix + item.aclName)) {
          return true;
        }
      }
      return false;
    },
  },
};
