import { NavigationActions, StackActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}

function goBack() {
  _navigator.dispatch(
    NavigationActions.back({}),
  );
}

function pop(number) {
  _navigator.dispatch(
    StackActions.pop({
      n: number,
    }),
  );
}

function resetScreen(routeName, params) {
  _navigator.dispatch(
    StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName, params }),
      ],
    }),
  );
}

export default {
  resetScreen,
  goBack,
  pop,
  navigate,
  setTopLevelNavigator,
};
