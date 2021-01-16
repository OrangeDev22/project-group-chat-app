import React, { useRef } from "react";
import { Avatar, Button } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { selectFriends } from "../features/friendsSlice";
import { makeStyles } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { useSocket } from "../contexts/SocketProvider";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginRight: 10,
  },
  unblock: {
    color: "white",
    marginLeft: 8,
    backgroundColor: grey[800],
    "&:hover": {
      background: grey[500],
    },
  },
}));

const handleScroll = (e) => {};

function BlockedList() {
  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 50,
    })
  );
  const socket = useSocket();
  const friends = useSelector(selectFriends);
  const blockedList = friends.usersBlocked;
  const classes = useStyles();

  const unblockUserHandler = (id, type) => {
    socket.emit("deleteRelationShip", id, type);
  };

  return (
    <div className="right-panel">
      <AutoSizer>
        {({ width, height }) => (
          <List
            width={width}
            height={height}
            rowHeight={cache.current.rowHeight}
            deferredMeasurementCache={cache.current}
            rowCount={blockedList.length}
            onScroll={(e) => handleScroll(e)}
            rowRenderer={({ key, index, style, parent }) => {
              let blockedRelationship = blockedList[index];

              return (
                <CellMeasurer
                  key={key}
                  cache={cache.current}
                  parent={parent}
                  columnIndex={0}
                  rowIndex={index}
                >
                  <div style={style} className="list_item">
                    {blockedList && (
                      <div className="right_panel_blocked_user_item">
                        <Avatar
                          className={classes.small}
                          style={{ marginRgith: 10 }}
                        >
                          {blockedRelationship.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <p>{blockedRelationship.name}</p>
                        <div className="blocked_user_button_container">
                          <Button
                            variant="contained"
                            size="small"
                            className={classes.unblock}
                            onClick={() =>
                              unblockUserHandler(
                                blockedRelationship.id,
                                blockedRelationship.type
                              )
                            }
                          >
                            Unblock
                          </Button>
                        </div>
                      </div>
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

export default BlockedList;
