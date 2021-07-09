pragma solidity >=0.4.22 <0.8.0;

contract Election {


    struct Candidate {
        //model
        uint id;
        string name;
        uint voteCount;
    }

    //store candidates to asoc array
    mapping(uint => Candidate) public candidates;

    // how many candidates in mapping
    uint public candidatesCount;


    constructor () public {
        addCandidate("Sandwich");
        addCandidate("Giant");
    }

    function addCandidate (string memory _name) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }
}
