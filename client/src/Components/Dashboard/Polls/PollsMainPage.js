import React, { Component } from 'react';
import Poll from 'react-polls';
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row'


// Declaring poll question and answers
const pollQuestion = 'Is react-polls useful?'
const pollAnswers = [
    { option: 'Yea', votes: 8 },
    { option: 'Nay', votes: 2 }
]

class PollsMainPage extends Component {
    // Setting answers to state to reload the component with each vote
    state = {
        pollAnswers: [...pollAnswers]
    }
    // Handling user vote
    // Increments the votes count of answer when the user votes
    handleVote = voteAnswer => {
        const { pollAnswers } = this.state
        const newPollAnswers = pollAnswers.map(answer => {
            if (answer.option === voteAnswer) answer.votes++
            return answer
        })
        this.setState({
            pollAnswers: newPollAnswers
        })
    }

    render() {
        const { pollAnswers } = this.state
        return (
            <div>
                {/* <Poll question={pollQuestion} answers={pollAnswers} onVote={this.handleVote} /> */}
                <Container>
                    <Row>
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>Bill C-130</Card.Title>
                                <Card.Link href="#">Bill Link</Card.Link>
                                <Card.Text>
                                    <small className="text-muted">12 December 2019</small>
                                </Card.Text>
                                <Card.Text>
                                    Some quick example text to build on the card title and make up the bulk of
                                    the card's content.
                    </Card.Text>
                                <Poll answers={pollAnswers} onVote={this.handleVote} />
                            </Card.Body>
                        </Card>
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>Bill D-76</Card.Title>
                                <Card.Link href="#">Bill Link</Card.Link>
                                <Card.Text>
                                    <small className="text-muted">1 November 2019</small>
                                </Card.Text>
                                <Card.Text>
                                    Some quick example text to build on the card title and make up the bulk of
                                    the card's content.
                    </Card.Text>
                                <Poll answers={pollAnswers} onVote={this.handleVote} />
                            </Card.Body>
                        </Card>
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>Motion 30</Card.Title>
                                <Card.Link href="#">Bill Link</Card.Link>
                                <Card.Text>
                                    <small className="text-muted">19 October 2019</small>
                                </Card.Text>
                                <Card.Text>
                                    Some quick example text to build on the card title and make up the bulk of
                                    the card's content.
                                </Card.Text>
                                <Poll answers={pollAnswers} onVote={this.handleVote} />
                            </Card.Body>
                        </Card>
                    </Row>

                </Container>
            </div>

        );
    }
};

export default PollsMainPage