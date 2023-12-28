import gql from "graphql-tag";

export const STORE_CARD_CONTENT = gql`
  fragment StoreCardContent on Store {
    id
    name
    imageUrl
    description
    displayCategory {
      id
      name
    }
    url
  }
`;

export const STORE_CARD_FULL_CONTENT = gql`
  fragment StoreCardFullContent on Store {
    id
    name
    slug
    description
    imageUrl
    followerCount
    announcementsCount
    url
    mainLocation {
      id
      location {
        id
        region {
          name
        }
        city {
          name
        }
      }
    }
    announcements(count: 6, page: 1) {
      data {
        id
        defaultMedia(size: SMALL) {
          mediaUrl
        }
      }
    }
  }
`;
