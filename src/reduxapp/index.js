import {Component, createElement, render, createStore} from '../framework';

const CREATE_NOTE = 'CREATE_NOTE';
const UPDATE_NOTE = 'UPDATE_NOTE';
const CLOSE_NOTE = 'CLOSE_NOTE';

const initialState = {
    nextNoteId: 1,
    notes: {},
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_NOTE: {
            console.log('create note action dispatched');
            const id = state.nextNoteId;
            const newNote = {
                id,
                content: '',
            };
            return {
                ...state,
                nextNoteId: id + 1,
                openNoteId: id,
                notes: {
                    ...state.notes,
                    [id]: newNote,
                },
            };
        }
        case UPDATE_NOTE: {
            const {id, content} = action;
            const editedNote = {
                ...state.notes[id],
                content,
            };

            return {
                ...state,
                notes: {
                    ...state.notes,
                    [id]: editedNote,
                },
            };
        }
        case CLOSE_NOTE: {
            return {
                ...state,
                openNoteId: null,
            };
        }
        default:
            break;
    }
};

const store = createStore(reducer);

const NoteEditor = ({note, onChangeNote, onCloseNote}) => (
    <div>
        <div>
            <textarea
                className="editor-content"
                autoFocus
                value={note.content}
                onChange={event => onChangeNote(note.id, event.target.value)}
                rows={10} cols={80}
            />
        </div>
        <button className="editor-button" onClick={onCloseNote}>Close</button>
    </div>
);

// class NoteEditor extends Component {
//     render() {
//         const { note, onChangeNote, onCloseNote } = this.props;
//         return (
//             <div>
//                 <div>
//                     <textarea
//                         className="editor-content"
//                         autoFocus
//                         value={note.content}
//                         onChange={event => onChangeNote(note.id, event.target.value)}
//                         rows={10} cols={80}
//                     />
//                 </div>
//                 <button className="editor-button" onClick={onCloseNote}>Close</button>
//             </div>
//         )
//     }
// }

const NoteTitle = ({note}) => {
    const title = note.content.split('\n')[0].replace(/^\s+|\s+$/g, '');
    if (title === '') {
        return <i>Untitled</i>;
    }
    return <span>{title}</span>;
};

// class NoteTitle extends Component {
//     render() {
//         const { note } = this.props;
//         const title = note.content.split('\n')[0].replace(/^\s+|\s+$/g, '');
//         if (title === '') {
//             return <i>Untitled</i>;
//         }
//         return <span>{title}</span>;
//     }
// }

const NoteLink = ({note, onOpenNote}) => (
    <li className="note-list-item">
        <a href="#" onClick={() => onOpenNote(note.id)}>
            <NoteTitle note={note} />
        </a>
    </li>
);

// class NoteLink extends Component {
//     render() {
//         const { note, onOpenNote } = this.props;
//         return (
//             <li className="note-list-item">
//                 <a href="#" onClick={() => onOpenNote(note.id)}>
//                     <NoteTitle note={note} />
//                 </a>
//             </li>
//         )
//     }
// }

const NoteList = ({notes, onOpenNote}) => (
    <ul className="note-list">
        { notes ?
            Object.keys(notes).map(id =>
                <NoteLink
                    key={id}
                    note={notes[id]}
                    onOpenNote={onOpenNote}
                />
            ) : null
        }
    </ul>
);

// class NoteList extends Component {
//     render() {
//         const { notes, onOpenNote } = this.props;
//         return (
//             <ul className="note-list">
//                 {notes ? Object.keys(notes).map(id =>
//                     <NoteLink
//                         key={id}
//                         note={notes[id]}
//                         onOpenNote={onOpenNote}
//                     />
//                 ) : null
//                 }
//             </ul>
//         )
//     }
// }

const NoteApp = ({
    notes, openNoteId, onAddNote, onChangeNote,
    onOpenNote, onCloseNote,
}) => (
        <div>
            {
                openNoteId ?
                    <NoteEditor
                        note={notes[openNoteId]} onChangeNote={onChangeNote}
                        onCloseNote={onCloseNote}
                    /> :
                    <div>
                        <NoteList notes={notes} onOpenNote={onOpenNote} />
                        <button className="editor-button" onClick={onAddNote}>New Note</button>
                    </div>
            }
        </div>
    );

// class NoteApp extends Component {
//     render() {
//         const { notes, openNoteId, onAddNote, onChangeNote, onOpenNote, onCloseNote } = this.props;
//         return (
//             <div>
//                 {
//                     openNoteId ?
//                         <NoteEditor
//                             note={notes[openNoteId]} onChangeNote={onChangeNote}
//                             onCloseNote={onCloseNote}
//                         /> :
//                         <div>
//                             <NoteList notes={notes} onOpenNote={onOpenNote} />
//                             <button className="editor-button" onClick={onAddNote}>New Note</button>
//                         </div>
//                 }
//             </div>
//         )
//     }
// }

class NoteAppContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {openNoteId: null};
        this.onAddNote = this.onAddNote.bind(this);
        this.onChangeNote = this.onChangeNote.bind(this);
        this.onOpenNote = this.onOpenNote.bind(this);
        this.onCloseNote = this.onCloseNote.bind(this);
    }

    componentWillMount() {
        console.log('note app will mount');
        this.unsubscribe = this.props.store.subscribe(() => {
            let newState = this.props.store.getState();
            console.log(newState);
            this.setState(newState);
        });
    }

    componentWillUnmount() {
        console.log('note app will unmount');
        this.unsubscribe();
    }

    onAddNote() {
        this.props.store.dispatch({
            type: CREATE_NOTE,
        });
    }

    onChangeNote(id, content) {
        this.props.store.dispatch({
            type: UPDATE_NOTE,
            id,
            content,
        });
    }

    onOpenNote(id) {
        console.log(`open note ${id}`);

        this.setState({
            openNoteId: id,
        });
    }

    onCloseNote() {
        this.props.store.dispatch({
            type: CLOSE_NOTE,
        });
    }

    render() {
        return (
            <NoteApp
                {...this.state}
                onAddNote={this.onAddNote}
                onChangeNote={this.onChangeNote}
                onOpenNote={this.onOpenNote}
                onCloseNote={this.onCloseNote}
            />
        );
    }
}

render(<NoteAppContainer store={store} />, document.getElementById('root'));
