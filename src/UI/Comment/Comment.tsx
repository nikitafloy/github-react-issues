import React, { useEffect, useState } from 'react';
import './Comment.scss';
import utils from '../../utils';
import { IComment, ICommentState } from '../../Interfaces/UI/Comment/IComment';
import bodyToMarkdown from './utils';

export const Comment = (props: IComment) => {  
    const [state, setState] = useState<ICommentState>({items: []});
    useEffect(() => {
        (async () => {
            const items = await bodyToMarkdown(props);
            return items instanceof Array 
                ? setState({items})
                : null;
        })();
    }, [props]);

    return <>
        { 
            state.items.length
                ? state.items.map((item, key) => (
                    <section key={key} className="Comment">
                        <div className="Comment__title">
                            <b><a href={item.html_url} target="_blank" rel="noopener noreferrer">{item.user.login}</a></b> оставил комментарий {utils.formatDate(item.created_at)}
                        </div>

                        <div className="Comment__body" dangerouslySetInnerHTML={{__html: item.body}}/>
                    </section>
                ))
                : <section className="Comment">
                    <div className="Comment__title">
                        <div className="loading_100"/>
                    </div>

                    <div className="Comment__body">
                        <div className="loading_100"/>
                        <div className="loading_100"/>
                        <div className="loading_100"/>
                        <div className="loading_100"/>
                    </div>
                </section>
        }
    </>;
};