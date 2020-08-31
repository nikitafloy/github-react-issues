import React, { useEffect, useState } from 'react';
import './Comment.scss';
import utils from '../../../utils';

export const Comment = props => {
    const [state, setState] = useState({items: []});
    useEffect(() => {
        if (props.items) {
            const fetchData = async () => {
                const items = await Promise.all(props.items.map(async item => {
                    const res = await utils.bodyToMarkdown(item.body);
                    if (res) {
                        return {
                            created_at: item.created_at, 
                            user: {
                                login: item.user.login,
                                html_url: item.html_url,
                            }, 
                            body: res.data,
                        };
                    } else {
                        console.error(res);
                        return props.globalProps.history.push('/');
                    };
                }));
                setState({...state, items});
            };
        
            fetchData();
        };
    }, [props]);

    return state.items.map((item, key) => (
        <section key={key} className="comment">
            <div className="title">
                <b><a href={item.user.html_url} target="_blank" rel="noopener noreferrer">{item.user.login}</a></b> оставил комментарий {utils.formatDate(item.created_at)}
            </div>

            <div className="body" dangerouslySetInnerHTML={{__html: item.body}}></div>
        </section>
    ));
};