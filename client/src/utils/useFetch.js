export const fetchFriends = async (id, numberPerPage, page, timestamp) => {
  try {
    let query = await fetch(
      `http://localhost:5000/user/friends?id=${id}&npp=${numberPerPage}&page=${page}&lts=${timestamp}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (query.status === 200) {
      let data = await query.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
  }
};

export const blockFriend = async (relationshipId, userId) => {
  try {
    const body = { relationshipId, userId };
    let query = await fetch(`http://localhost:5000/user/friends/block`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    if (query.status === 200) {
      let type = await query.text();
      return type;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
  }
};

export const fetchRequests = async (
  id,
  numberPerPage,
  page,
  type,
  timestamp
) => {
  try {
    let query = await fetch(
      `http://localhost:5000/user/requests?id=${id}&npp=${numberPerPage}&page=${page}&type=${type}&lts=${timestamp}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (query.status === 200) {
      let data = await query.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

export const blockRelationship = async (id, type) => {
  try {
    let query = await fetch(
      `http://localhost:5000/relationship/block?id=${id}&${type}`,
      {
        method: "PUT",
        credentials: "include",
      }
    );

    if (query.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchBlockedRelationships = async (id) => {
  try {
    let query = await fetch(`http://localhost:5000/user/block?id=${id}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await query.json();

    if (query.status === 200) {
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteRelationship = async (id) => {
  try {
    let query = await fetch(
      `http://localhost:5000/relationships/delete?id=${id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (query.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};
