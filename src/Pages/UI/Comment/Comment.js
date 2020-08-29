import React, { useEffect, useState } from 'react';
import './Comment.scss';
import utils from '../../../utils';

export const Comment = props => {
    const [state, setState] = useState({items: []});

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all(props.items.map(async item => {
                const res = await utils.bodyToMarkdown(item.body);
                if (res) {
                    return res.data;
                } else {
                    console.error(res);
                    return props.globalProps.history.push('/');
                };
            }));
            setState({items: props.items});
        };
        fetchData();
    }, [props]);   

    return state.items.map((item, key) => (
        <section key={key} className="comment">
            <div className="title">
                <b>{item.user.login}</b> оставил комментарий {utils.formatDate(item.created_at)}
            </div>

            <div className="body" dangerouslySetInnerHTML={{__html: item.body}}></div>
        </section>
    ));
};