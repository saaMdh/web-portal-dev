import MessageBox from "@/mixins/MessageBox";
import Queries from "@/views/Announcement/Announcement.graphql";

export default {
  mixins: [MessageBox],

  methods: {
    async submitComment(id, message, commentId = null) {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: Queries.Comment,
          variables: {
            id: id,
            message,
            commentId
          }
        });
        return {
          ...data.announcementCommentCreate,
          likesCount: 0,
          dislikesCount: 0
        };
      } catch (error) {
        //FIXME: memory-leaks
        await this.$alert({
          message: this.$t("comment.alert.error.0")
        });
      }
    }
  }
};
