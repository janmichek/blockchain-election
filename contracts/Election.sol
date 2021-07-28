pragma solidity >=0.4.22 <0.8.0;

contract Election {


    struct Candidate {
        //model
        uint id;
        string name;
        uint voteCount;
    }


    mapping(address => bool) public voters;

    //store candidates to asoc array
    mapping(uint => Candidate) public candidates;

    // how many candidates in mapping
    uint public candidatesCount;


    constructor () public {
        addCandidate("Sandwich");
        addCandidate("Giant");
    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public {
        require(!voters[msg.sender]);
        require(_candidateId > 0 && _candidateId <= candidatesCount);
        voters[msg.sender] = true;
        candidates[_candidateId].voteCount ++;
    }
}
