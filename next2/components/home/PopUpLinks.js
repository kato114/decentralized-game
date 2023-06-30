import { useEffect, useContext } from 'react';
import { GlobalContext } from '@/store';
import { Menu, Button, Icon } from 'semantic-ui-react';
import { useDarkMode } from 'hooks';

const PopUpLinks = props => {
  // dispatch theme (light or dark mode) to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [theme, toggleTheme] = useDarkMode();

  useEffect(() => {
    dispatch({
      type: 'toggle_theme',
      data: theme
    });
  }, [theme]);

  return (
    <Button className="more-dropdown-button" onClick={toggleTheme}>
      {props.isDarkMode ? (
        <Menu.Item style={{ color: 'white', fontSize: '8px', marginLeft: '-3px', marginTop: '0px' }}>
          <Icon style={{ color: 'white' }} name="moon" />
        </Menu.Item>
      ) : (
        <Menu.Item style={{ color: 'white', fontSize: '9px', marginLeft: '-5px', marginTop: '-2px' }}>
          <Icon style={{ color: 'white' }} name="sun" />
        </Menu.Item>
      )}
    </Button>
  );
};

export default PopUpLinks;
