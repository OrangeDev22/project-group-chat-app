import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { selectApp, setSelectedConversation } from "../features/app";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";

function ConversationsList() {
  const history = useHistory();
  const app = useSelector(selectApp);
  const dispatch = useDispatch();
  const conversations = app.conversations;
  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 50,
    })
  );

  const clickHandler = (id, index) => {
    dispatch(setSelectedConversation(index));
    history.push(`/dashboard/${id}`);
  };

  return (
    <div className="conversations">
      <AutoSizer>
        {({ width, height }) => (
          <List
            width={width}
            height={height}
            rowHeight={cache.current.rowHeight}
            rowCount={conversations.length}
            rowRenderer={({ key, index, style, parent }) => {
              let conversation = conversations[index];
              return (
                <CellMeasurer
                  key={key}
                  cache={cache.current}
                  parent={parent}
                  columnIndex={0}
                  rowIndex={index}
                >
                  <div
                    style={style}
                    className={`list_item_wrapper ${
                      index === app.selectedConversationIndex
                        ? "selected_conversation"
                        : ""
                    }`}
                    onClick={() => clickHandler(conversation.id, index)}
                  >
                    {conversations.length > 0 && (
                      <>
                        <div className="conversations_list_item">
                          {conversation.recipients.map((recipient, index) => {
                            return (
                              <div className="conversation_list_recipients">
                                <span>{recipient.name}</span>
                              </div>
                            );
                          })}{" "}
                        </div>
                      </>
                    )}
                  </div>
                </CellMeasurer>
              );
            }}
          ></List>
        )}
      </AutoSizer>
    </div>
  );
}

export default ConversationsList;
