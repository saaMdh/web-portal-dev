import gql from "graphql-tag";

export const ANNOUNCEMENT_MINI_CONTENT = gql`
  fragment AnnouncementMiniContent on Announcement {
    id
    title
    slug
    isFromStore
    isCommentEnabled
    store {
      id
    }
    store @skip(if: $hideStore) {
      name
      imageUrl
      isOfficial
      isVerified
    }
    defaultMedia(size: $mediaSize) {
      mediaUrl
    }
    userReaction {
      isBookmarked
      isLiked
    }
    category {
      id
      slug
    }
    hasDelivery
    deliveryType
    likeCount
    status
    pricePreview
    priceUnit
    oldPrice
    oldPricePreview
    user {
      id
    }
  }
`;

export const PROMOTION_MINI_CONTENT = gql`
  fragment PromotionMiniContent on PromotionAnnouncement {
    id
    title
    slug
    store @skip(if: $hideStore) {
      id
      name
      imageUrl
    }
    defaultMedia(size: $mediaSize) {
      mediaUrl
      mimeType
      thumbnail
    }
    pricePreview
    priceUnit
    oldPrice
    oldPricePreview
    userId
    userReaction {
      isBookmarked
      isLiked
    }
    likeCount
  }
`;

export const ANNOUNCEMENT_CONTENT = gql`
  fragment AnnouncementContent on Announcement {
    id
    title
    slug
    createdAt: refreshedAt
    isFromStore
    isCommentEnabled
    userReaction {
      isBookmarked
      isLiked
    }
    hasDelivery
    deliveryType
    likeCount
    description
    status
    cities {
      id
      name
      slug
      region {
        id
        name
        slug
      }
    }
    store {
      id
      name
      slug
      imageUrl
    }
    user {
      id
    }
    defaultMedia(size: $mediaSize) {
      mediaUrl
      mimeType
      thumbnail
    }
    price
    pricePreview
    priceUnit
    oldPrice
    oldPricePreview
    priceType
    exchangeType
    category {
      id
      slug
    }
  }
`;

export const ANNOUNCEMENT_FULL_CONTENT = gql`
  fragment AnnouncementFullContent on Announcement {
    id
    title
    slug
    createdAt: refreshedAt
    isFromStore
    store {
      id
      name
      imageUrl
    }
    specs {
      specification {
        label
      }
      valueText
    }
    defaultMedia(size: SMALL) {
      mediaUrl
    }
    userReaction {
      isBookmarked
      isLiked
    }
    likeCount
    locations {
      location {
        city {
          slug
          name
        }
        region {
          name
          slug
        }
      }
    }
    pricePreview
    priceUnit
    oldPrice
    oldPricePreview
    categories {
      id
      name
    }
    user {
      id
      avatarUrl
      displayName
    }
  }
`;
