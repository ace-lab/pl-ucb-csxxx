import random
import matplotlib.pyplot as plt
import prairielearn as pl
import numpy as np
alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

class Node:
    def __init__(self, value, graph):
        self.value =  value
        self.val_alpha = alphabet[value]
        self.edges = []
        self.graph = graph

    def add_edge(self, edge, left=True):
        if left:
            self.edges.append(edge)
            self.graph.matrix[edge.node_right.value][self.value] = edge.weight
        else:
            self.edges.append(edge)

class Edge:
    def __init__(self, left, right, weight=1):
        self.node_left = left
        self.node_right = right
        self.weight = weight
        self.node_left.add_edge(self)
        self.node_right.add_edge(self, False)
        self.graphImage = None

    def __repr__(self):
        return str(self.node_left.value) + "-->" + str(self.node_right.value)

class ErnosRyendiGraph:
    def __init__(self, n, p, randomize_weights=False, weights_range=(1, 10), guarantee_connected=False, guarantee_disconnected=False, guarantee_one_source=False, directed=True):
        #guarantee_disconnected guaruntee_connected not yet implemented
        self.n = n
        self.p = p
        self.nodes = []
        self.edges = []
        self.matrix = []
        for i in range(n):
            self.nodes.append(Node(i, self))
            self.matrix.append([0 for i in range(n)])
        if directed:
            for i in range(n):
                for j in range(i + 1, n):
                    if random.random() < p:
                        if randomize_weights:
                            edge = Edge(self.nodes[i], self.nodes[j], random.randint(weights_range[0], weights_range[1]))
                        else:
                            edge = Edge(self.nodes[i], self.nodes[j])
                        self.edges.append(edge)

            if guarantee_one_source:
                for node in self.nodes:
                    if len([0 for i in self.edges if i.node_right == node]) == 0:
                        j == node.value
                        while j == node.value:
                            j = 0
                        if randomize_weights:
                            edge = Edge(self.nodes[i], self.nodes[j], random.randint(weights_range[0], weights_range[1]))
                            self.edges.append(edge)
                        else:
                            edge = Edge(self.nodes[i], self.nodes[j])

                            self.edges.append(edge)

            if guarantee_connected:
                for node in self.nodes:
                    if len(node.edges) == 0:
                        j == node.value
                        while i == node.value:
                            i = random.randint(0, n)
                        if randomize_weights:
                            edge = Edge(self.nodes[i], self.nodes[j], random.randint(weights_range[0], weights_range[1]))
                            self.edges.append(edge)
                        else:
                            edge = Edge(self.nodes[i], self.nodes[j])

                            self.edges.append(edge)

        if not directed:

            e = 20
            edge = Edge(self.nodes[0], self.nodes[1], random.randint(weights_range[0], weights_range[1]))
            self.edges.append(edge)
            edge = Edge(self.nodes[random.randint(0, 1)], self.nodes[2], random.randint(weights_range[0], weights_range[1]))
            self.edges.append(edge)
            for i in range(3, n):
                num = random.randint(1, 3)
                if i == 3:
                    num = random.randint(1, 2)
                nums = random.sample(range(0, i-1), num)
                for j in nums:
                    edge = Edge(self.nodes[j], self.nodes[i], random.randint(weights_range[0], weights_range[1]))
                    self.edges.append(edge)




    def generate_graphviz(self): #change this depending on whether or not the weights are on
        gra = Digraph()
        for i in self.nodes:
            gra.node(alphabet[i.value], alphabet[i.value])
        for i in self.edges:
            gra.edge(alphabet[i.node_left.value], alphabet[i.node_right.value], label=str(i.weight))
        gra.render('Machine.gv.pdf', view=True)


    def undirect_matrix(self):
        for i in range(self.n):
            for j in range(self.n):
                if self.matrix[i][j] != 0:
                    self.matrix[j][i] = self.matrix[i][j]


    def prims_basic_autograder(self):
        def minKey(key, mstSet):
            min = 1000000
            min_index = None
            for v in range(self.n):
                if key[v] < min and mstSet[v] == False:
                    #print('key[v]:', key[v])
                    min = key[v]
                    min_index = v
            #print("v:", v)
            return min_index

        key = [1000000] * self.n
        parent = [None] * self.n
        key[0] = 0
        mstSet = [False] * self.n

        parent[0] = -1  # First node is always the root of
        order = []
        for cout in range(self.n):
            #print("order:", order)
            #print("mstSet:", mstSet)
            #print("key:", key)
            u = minKey(key, mstSet)
            mstSet[u] = True
            order.append(u)
            #print("matrix:", self.matrix)
            for v in range(self.n):
                if self.matrix[u][v] > 0 and mstSet[v] == False and key[v] > self.matrix[u][v]:
                    key[v] = self.matrix[u][v]
                    parent[v] = u

        key = {}
        for i in self.nodes:
            key[i.val_alpha] = order.index(i.value)
        return key
            
def generate(data):
    g = ErnosRyendiGraph(9, 0.3, randomize_weights=True, directed=False)
    g.undirect_matrix()
    mat = g.matrix
    data["params"]["labels"] = pl.to_json(alphabet[:9])
    data["params"]["matrix"] = pl.to_json(mat)
    data["correct_answers"] = g.prims_basic_autograder()

