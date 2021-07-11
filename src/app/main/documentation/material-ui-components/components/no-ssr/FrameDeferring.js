import { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import NoSsr from '@material-ui/core/NoSsr';

const useStyles = makeStyles({
  container: {
    width: 300,
    display: 'flex',
    flexWrap: 'wrap',
  },
});

function LargeTree() {
  return Array.from(new Array(5000)).map((_, index) => <span key={index}>.</span>);
}

export default function FrameDeferring() {
  const classes = useStyles();
  const [state, setState] = useState({ open: false, defer: false });

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          setState({
            open: !state.open,
            defer: false,
          })
        }
      >
        {'Render NoSsr defer="false"'}
      </button>
      <br />
      <button
        type="button"
        onClick={() =>
          setState({
            open: !state.open,
            defer: true,
          })
        }
      >
        {'Render NoSsr defer="true"'}
      </button>
      <br />
      <br />
      <div className={classes.container}>
        {state.open ? (
          <Fragment>
            <div>Outside NoSsr</div>
            <NoSsr defer={state.defer}>
              .....Inside NoSsr
              <LargeTree />
            </NoSsr>
          </Fragment>
        ) : null}
      </div>
    </div>
  );
}
