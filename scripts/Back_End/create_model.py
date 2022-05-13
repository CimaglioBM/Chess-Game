#///////////////////////////////////////////////#
#
# create the model
#
#///////////////////////////////////////////////#
from tensorflow.keras.layers import Conv2D,Dense,Flatten,Dropout
from tensorflow.keras.models import Sequential

def createModel():
    model = Sequential()

    model.add(Conv2D(64, 3,input_shape = (14,8,8,1)))
    #model.add(Dropout(0.2))

    model.add(Conv2D(64, 3))
    model.add(Dropout(0.2))

    model.add(Flatten())
    
    model.add(Dense(5, activation="softmax"))
    #model.add(Dense(1, activation="linear"))

    #print(model.summary())
    return model 

