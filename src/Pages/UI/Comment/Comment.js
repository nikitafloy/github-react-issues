import React from 'react';
import './Comment.scss';
import utils from '../../../utils';

export const Comment = props => props.item.map((item, key) => (
    <section key={key} className="comment">
        <div className="title">
            <b>{item.user.login}</b> оставил комментарий {utils.formatDate(item.created_at)}
        </div>

        <div className="body">
            {item.body}
        </div>
    </section>
));