import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectFriends, setPendingRequests } from "../features/friendsSlice";
import { selectUser } from "../features/user";
import { Button, Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { useSocket } from "../contexts/SocketProvider";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";
import { fetchRequests } from "../utils/useFetch";

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginRight: 10,
  },
}));

function PendingRequestsList() {
  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 50,
    })
  );
  const [page, setPage] = useState(1);
  const socket = useSocket();
  const classes = useStyles();
  const user = useSelector(selectUser);
  const friends = useSelector(selectFriends);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const pendingRequestsList = friends.pendingRequests;

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e;
    let bottom = Math.ceil(scrollHeight) - Math.round(scrollTop);
    if (!loading) {
      if (bottom === clientHeight) {
        setPage((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    const loadRequests = async () => {
      let lastTimestamp =
        pendingRequestsList[pendingRequestsList.length - 1].timestamp;
      setLoading(true);
      const newPendingRequests = await fetchRequests(
        user.user.id,
        20,
        page,
        "pending_request",
        lastTimestamp
      );
      console.log("NEW REQUEST", newPendingRequests);
      if (newPendingRequests) {
        dispatch(setPendingRequests(newPendingRequests));
      }
      setLoading(false);
    };
    if (page > 1 && pendingRequestsList.length > 0) {
      loadRequests();
    }
  }, [page]);

  useEffect(() => {
    // setpendingRequestsList(friends.pendingRequests);
  }, [friends.pendingRequests]);

  const handleCancelRequest = (id) => {
    socket.emit("deleteRelationShip", id, "request_sender");
  };

  return (
    <div className="right-panel">
      <AutoSizer>
        {({ width, height }) => (
          <List
            width={width}
            height={height}
            onScroll={(e) => handleScroll(e)}
            rowHeight={cache.current.rowHeight}
            deferredMeasurementCache={cache.current}
            rowCount={pendingRequestsList.length}
            rowRenderer={({ key, index, style, parent }) => {
              let request = pendingRequestsList[index];
              return (
                <CellMeasurer
                  key={key}
                  cache={cache.current}
                  parent={parent}
                  columnIndex={0}
                  rowIndex={index}
                >
                  <div style={style} className="liste_item">
                    <div className="right-panel-pending-request-item">
                      <Avatar className={classes.small}>
                        {request.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <p>{request.name}</p>
                      <div className="pending-request-button-container">
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => {
                            handleCancelRequest(request.id);
                          }}
                        >
                          Cancel Request
                        </Button>
                      </div>
                    </div>
                  </div>
                </CellMeasurer>
              );
            }}
          ></List>
        )}
      </AutoSizer>
      {loading && <h1>Loading...</h1>}
    </div>
  );
}

export default PendingRequestsList;
