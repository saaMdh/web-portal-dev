import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { computed, ref, getCurrentInstance } from "vue";
import Queries from "./AnnounStatus.graphql";
import env from "@/utils/env";
import { watch } from "vue";
const STATUS = ["PUBLISHED", "EDITED"];
const ACTIONS_NEED_LOGIN = ["LIKE", "BOOKMARK", "CHAT"];

export default function (props) {
  const vm = getCurrentInstance().appContext.config.globalProperties;
  const flagDialog = ref(null);

  const canDoActions = computed(() => {
    return STATUS.includes(props.announcement.status);
  });

  const { user } = useAuthFrame();
  const loading = ref(0);
  const likeCount = ref(0);
  const isBookmarked = ref(false);
  const isLiked = ref(false);

  
  watch(
    () => props.announcement.likeCount,
    () => {
      likeCount.value = props.announcement.likeCount;
    },
    { immediate: true }
  );

  watch(
    () => props.announcement.userReaction,
    () => {
      isBookmarked.value =
        user.value !== null && props.announcement
          ? props.announcement.userReaction &&
            props.announcement.userReaction.isBookmarked
          : false;

      isLiked.value =
        user.value !== null
          ? props.announcement.userReaction &&
            props.announcement.userReaction.isLiked
          : false;
    },
    { immediate: true }
  );

  const like = async function () {
    loading.value++;
    const old_isLiked = isLiked.value;
    try {
      isLiked.value = !old_isLiked;
      const { data } = await vm.$apollo.mutate({
        mutation: old_isLiked ? Queries.Dislike : Queries.Like,
        variables: { id: props.announcement.id }
      });
      if (isLiked.value) {
        if (data.likeData && data.likeData.status) {
          likeCount.value = data.likeData.count;
        } else isLiked.value = !isLiked.value;
      } else {
        if (data.dislikeData && data.dislikeData.status) {
          likeCount.value = data.dislikeData.count;
        } else isLiked.value = !isLiked.value;
      }
    } catch (error) {
      isLiked.value = !isLiked.value;
      if (env.isDev) console.error(error);
    }

    loading.value--;
  };

  const bookmark = async function () {
    loading.value++;
    const old_isBookmarked = isBookmarked.value;
    try {
      isBookmarked.value = !isBookmarked.value;

      const { data } = await vm.$apollo.mutate({
        mutation: old_isBookmarked
          ? Queries.BookmarkRemove
          : Queries.BookmarkAdd,
        variables: { id: props.announcement.id }
      });

      if (data.bookmarkData && data.bookmarkData.status) {
        //
      } else isBookmarked.value = !isBookmarked.value;
    } catch (error) {
      isBookmarked.value = !isBookmarked.value;
      if (env.isDev) console.error(error);
    }

    loading.value--;
  };

  const chatWith = function () {
    let receiver = {};
    if (props.announcement.store) {
      receiver = { type: "STORE", id: props.announcement.store.id };
    } else {
      receiver = {
        type: "USER",
        id: props.announcement.userId || props.announcement.user.id
      };
    }
    return vm.$messenger.chatWith(receiver, {
      announcement: {
        id: props.announcement.id,
        title: props.announcement.title,
        slug: props.announcement.slug,
        defaultMedia: props.announcement.defaultMedia
      }
    });
  };

  const startChat = function () {
    if (user.value) return chatWith();
    vm.$router.push({ name: "login" });
  };

  const checkAction = function (action) {
    const needLogin = ACTIONS_NEED_LOGIN.includes(action);
    if (!canDoActions.value)
      return vm.$store.commit("dialog/openDialog", {
        name: "modelStatus"
      });
    if (!user.value && needLogin)
      return vm.$store.commit("dialog/openDialog", {
        name: "modelConnexion"
      });
    switch (action) {
      case "LIKE":
        like();
        break;
      case "BOOKMARK":
        bookmark();
        break;
      case "CHAT":
        startChat();
        break;
      case "FLAG":
        flagDialog.value.open();
        break;
    }
  };

  return {
    flagDialog,
    canDoActions,
    isBookmarked,
    loading,
    likeCount,
    isLiked,
    like,
    bookmark,
    chatWith,
    startChat,
    checkAction
  };
}
