1. constructor
1. render
  2. constructor
  2. render
  2. didMount
1. didMount


/* tslint:disable */

/** 1.
 * DON'T BIND VALUES IN FUNCTIONS IN RENDER:
 * Every time the parent’s render method is called, a new function (with a new reference) is created to be passed to likeComment.
 * If you inline an object in JSX, it will fail PureComponent prop diff and move on to more expensive React elements.
 * Arrays and Functions are Objects in JS. {} !== {}
 * */
<CommentItem likeComment={() => this.likeComment(user.id)} />
  should be:
<CommentItem likeComment={this.likeComment} userID={user.id} />
class CommentItem extends PureComponent {
    handleLike() {
        this.props.likeComment(this.props.userID);
    }
}

// first render
<Avatar user={{ id: ‘ryan’ }} />
// next render
<Avatar user={{ id: ‘ryan’ }} />
// prop diff thinks something changed because {} !== {}
// element diff (reconciler) finds out that nothing changed



/** 2.1
 * DON'T DERIVE DATA IN THE RENDER METHOD:
 * 'topTen' will have a brand new REFERENCE each time the component re-renders, 
 * even if posts hasn’t changed and the derived data is the same. 
 * This will then re-render the list needlessly.
 * */
class CacheComponent extends React.Component {
    render() {
        const {cities} = this.props;
        const topCities = cities.filter(_ => _);   // .filter() .map() CREATES A NEW ARRAY FROM cities EACH TIME!

        return (
            <ChildComponent cities={topCities} />
        );
    }
}
/** 2.2
 * You can solve this by caching your derived data. 
 * For example, Set the derived data in the component’s state and update only when the posts have updated.
 * */
class CacheComponent extends React.Component {
    componentWillMount() {
        this.setTopCities(this.props.cities);
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.cities !== nextProps.cities) {
            this.setToptopCities(nextProps);
        }
    }
    setTopTenPosts(cities) {
        this.setState({
            topCities: cities.filter(_ => _)
        });
    }
    render() {
        return (
            <ChildComponent cities={this.state.topCities} />
        );
    }
}


/** 3.1
 * A NORMAL COMPONENT FOR EVERYTHING
 */
class InitialComponent extends React.Component {
    state = {
        users: []
    };
    componentDidMount() {
        setTimeout(() => {
            this.setState({ users: [{id:1, name:'Ryan', active:true}, {id:2, name:'Michael', active:true}] });
        }, 1000);
    }
    toggleUser(userId) {
        /* ... */
    }
    render() {
        return (
            <ul className="user-list">
                {this.state.users.map(user => {
                    return (
                        <li key={user.id}>
                            <Link to="{'/users/' + user.id}">{user.name}</Link>
                            <button onClick={this.toggleActive(user.id)}>Toggle Active</button>
                        </li>
                    );
                })}
            </ul>
        );
    }
}

/** 3.2
 * A Better presentational component + its container
 */
class UsersComponent extends React.Component {
    render() {
        return (
            <ul className="user-list">
                {this.props.users.map(user => {
                    return (
                        <li key={user.id}>
                            <Link to="{'/users/' + user.id}">{user.name}</Link>
                            <button onClick={this.toggleActive(user.id)}>Toggle Active</button>
                        </li>
                    );
                })}
            </ul>
        );
    }
}

/** 3.3
 * The final presentational component & the container component
 */
class UsersComponent extends React.Component {
    createListItem = (user) => {
        return (
            <li key={user.id}>
                <Link to="{'/users/' + user.id}">{user.name}</Link>
                <button onClick={this.props.toggleActive(user.id)}>Toggle Active</button>
            </li>
        );
    }
    render() {
        return (
            <ul className="user-list">
                {this.props.users.map( this.createListItem )}
            </ul>
        );
    }
}
class UsersContainer extends React.Component {
    state = {
        users: []
    };
    componentDidMount() {
        setTimeout(() => {
            this.setState({ users: [{id:1, name:'Ryan', active:true}, {id:2, name:'Michael', active:true}] });
        }, 1000);
    }
    toggleActive = (userId) => {
        /* ... */
    };
    render() {
        return (
            <UsersComponent 
                users={this.state.users} 
                toggleActive={this.toggleActive} />
        );
    }
}
