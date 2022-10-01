import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { wsConnection } from 'utils/ws-connection/connection';
import { WsMessage } from './types';
import { updateStateFromWsMessage } from './slice';

export const wsApi = createApi({
  // Artificial based query, it is required by the createApi function
  // The query is overwritten in all the above enpoints
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),

  endpoints: (builder) => ({
    sendMessage: builder.mutation<void, any>({
      // Overwrite the baseQuery with a custom query that
      // sends a WS message and returnsa promise that gets resolved
      // if the message is sent successfully
      queryFn: (data) => {
        return new Promise((resolve) => {
          wsConnection
            .sendMessage(data)
            .then(() => resolve({ data: undefined }));
        });
      },
    }),

    // This is an endpoint that returns all the WS messages
    // For now the messages are not used diretly in the app, maybe only
    // for logging purposes.
    //
    // The real purpose is to dispatch `updateStateFromWsMessage`
    // for every message that we get from the ws server
    wsListener: builder.query<{ messages: WsMessage[] }, void>({
      // Overwrite the baseQuery with a custom query that retrieves
      // the WS messages from the server (initially an empty array)
      queryFn() {
        return { data: { messages: [] } };
      },
      // onCacheEntryAdded is a function called whenever a component
      // creates a subscription via the `useSendMessageMutation` hook
      async onCacheEntryAdded(
        unusedVoidArg,
        { dispatch, cacheEntryRemoved, updateCachedData, cacheDataLoaded }
      ) {
        await cacheDataLoaded;

        const onWsMessage = (event: any) => {
          const message = JSON.parse(event.data);
          console.log(message);

          setTimeout(() => dispatch(updateStateFromWsMessage(message)), 500);
          updateCachedData((currentCacheData) => {
            currentCacheData.messages.push(message);
          });
        };

        wsConnection.addListener(onWsMessage);

        await cacheEntryRemoved;
        wsConnection.removeListener(onWsMessage);
      },
    }),
  }),
});

export const { useSendMessageMutation, useWsListenerQuery } = wsApi;
