import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Avatar } from "@material-ui/core";
import { selectFriends } from "../features/friendsSlice";
import { makeStyles } from "@material-ui/core";
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
}));

function FriendsList() {
  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 50,
    })
  );
  const friends = useSelector(selectFriends);
  const friendsList = friends.friends;
  const classes = useStyles();

  return (
    <div className="friends_list">
      <AutoSizer>
        {({ width, height }) => (
          <List
            width={width}
            height={height}
            rowHeight={cache.current.rowHeight}
            deferredMeasurementCache={cache.current}
            rowCount={friendsList.length}
            // onScroll={(e) => handleScroll(e)}
            rowRenderer={({ key, index, style, parent }) => {
              let friend = friendsList[index];
              return (
                <CellMeasurer
                  key={key}
                  cache={cache.current}
                  parent={parent}
                  columnIndex={0}
                  rowIndex={index}
                >
                  <div style={style} className="list_item">
                    {friendsList && (
                      <div className="side_bar_friend_list_item">
                        <Avatar
                          className={classes.small}
                          style={{ marginRight: 10 }}
                        >
                          {friend.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <p>{friend.name}</p>
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

export default FriendsList;
