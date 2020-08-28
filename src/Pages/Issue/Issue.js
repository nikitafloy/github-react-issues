import React from "react";

export const Issue = props => {
  const {login, repo, id} = props.match.params;
  return (
    <main className="Issue">
      {`https://api.github.com/repos/${login}/${repo}/issues/${id}`}
    </main>
  )
};