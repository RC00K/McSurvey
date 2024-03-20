import React, { useEffect } from 'react';
import { Prompt, useHistory } from 'react-router-dom';

const BackButtonListener = () => {
    const history = useHistory();
    const [isBlocking, setIsBlocking] = React.useState(false);

    useEffect(() => {
        return history.listen((location, action) => {
            if (action === 'POP') {
                setIsBlocking(true);
            }
        });
    }, [history]);

    return (
        <Prompt
            when={isBlocking}
            message={location => {
                if (location.pathname === '/survey') {
                    return 'Are you sure you want to leave?';
                }

                return true;
            }}
        />
    );
};

export default BackButtonListener;