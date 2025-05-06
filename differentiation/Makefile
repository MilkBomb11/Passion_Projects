cc = g++
target = main
objs = main.o

all : main

$(target) : $(objs)
	$(cc) -o $(target) $(objs)

.PHONY : clean
.PONHY : run

clean:
	rm $(target) $(objs)

run:
	./$(target)