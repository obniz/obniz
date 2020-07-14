"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.PageInfoFieldsFragmentDoc = graphql_tag_1.default `
  fragment pageInfoFields on pageInfo {
    hasPreviousPage
    hasNextPage
  }
`;
exports.InstallEdgeFieldsFragmentDoc = graphql_tag_1.default `
  fragment installEdgeFields on installEdge {
    node {
      id
      configs
      createdAt
      updatedAt
      user {
        id
        name
        email
        picture
        createdAt
        credit
      }
      devicesInConfig {
        id
        access_token
        description
        hardware
        os
        osVersion
        region
        status
        createdAt
      }
    }
  }
`;
exports.DeviceEdgeFieldsFragmentDoc = graphql_tag_1.default `
  fragment deviceEdgeFields on deviceEdge {
    node {
      id
      access_token
      description
      hardware
      os
      osVersion
      region
      status
      createdAt
    }
  }
`;
exports.EventEdgeFieldsFragmentDoc = graphql_tag_1.default `
  fragment eventEdgeFields on eventEdge {
    node {
      id
      name
      trigger
      action
      webhookUri
      createdAt
    }
  }
`;
exports.WebappDocument = graphql_tag_1.default `
  query webapp($first: first, $skip: skip) {
    webapp {
      id
      title
      installs(first: $first, skip: $skip) {
        pageInfo {
          ...pageInfoFields
        }
        edges {
          ...installEdgeFields
        }
      }
    }
  }
  ${exports.PageInfoFieldsFragmentDoc}
  ${exports.InstallEdgeFieldsFragmentDoc}
`;
exports.UserDocument = graphql_tag_1.default `
  query user {
    user {
      id
      name
      email
      picture
      plan
      credit
      createdAt
    }
  }
`;
exports.DevicesDocument = graphql_tag_1.default `
  query devices($first: first, $skip: skip) {
    devices(first: $first, skip: $skip) {
      totalCount
      pageInfo {
        ...pageInfoFields
      }
      edges {
        ...deviceEdgeFields
      }
    }
  }
  ${exports.PageInfoFieldsFragmentDoc}
  ${exports.DeviceEdgeFieldsFragmentDoc}
`;
exports.EventsDocument = graphql_tag_1.default `
  query events($first: first, $skip: skip) {
    events(first: $first, skip: $skip) {
      totalCount
      pageInfo {
        ...pageInfoFields
      }
      edges {
        ...eventEdgeFields
      }
    }
  }
  ${exports.PageInfoFieldsFragmentDoc}
  ${exports.EventEdgeFieldsFragmentDoc}
`;
const defaultWrapper = (sdkFunction) => sdkFunction();
function getSdk(client, withWrapper = defaultWrapper) {
    return {
        webapp(variables) {
            return withWrapper(() => client.request(graphql_1.print(exports.WebappDocument), variables));
        },
        user(variables) {
            return withWrapper(() => client.request(graphql_1.print(exports.UserDocument), variables));
        },
        devices(variables) {
            return withWrapper(() => client.request(graphql_1.print(exports.DevicesDocument), variables));
        },
        events(variables) {
            return withWrapper(() => client.request(graphql_1.print(exports.EventsDocument), variables));
        },
    };
}
exports.getSdk = getSdk;

//# sourceMappingURL=sdk.js.map
